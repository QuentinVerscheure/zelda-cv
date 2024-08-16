import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CvContent } from '../../../models/Cv_content.enum';
import { map } from 'rxjs/operators';
import * as yaml from 'js-yaml';

@Injectable({
  providedIn: 'root',
})
export class CvContentService {
  private cvContentUrl: string = 'assets/texts/CV_content.yaml';
  private cvContent: CvContent | undefined;

  //frame coordinate from top left to bottom right
  private frameCoordinates = [
    { x: 112, y: 48 },
    { x: 320, y: 48 },
    { x: 528, y: 48 },
    { x: 736, y: 48 },
    { x: 112, y: 272 },
    { x: 320, y: 272 },
    { x: 528, y: 272 },
    { x: 736, y: 272 },
  ];

  constructor(private http: HttpClient) {}

  /**
   *  Load and display the content of the CV frames
   */
  loadYaml(scene: Phaser.Scene,): void {
    this.getCvContent().subscribe((datas: CvContent) => {
      this.cvContent = datas;
      this.cvContent.cv.forEach((section) => {
        if (section.picture && section.pictureUrl) {
          scene.load.image(section.picture, section.pictureUrl);
        }
      })
    });
  }

  getCvContent(): Observable<CvContent> {
    return this.http
      .get(this.cvContentUrl, { responseType: 'text' })
      .pipe(map((yamlContent: string) => yaml.load(yamlContent) as CvContent));
  }

  displayTexts(
    scene: Phaser.Scene,
    scaleOfTheGame: number
  ): void {
    if (!this.cvContent) {
      console.log('no cvContent loaded');
      return; // Ensure texts are loaded before trying to display them
    }

    const textStyle = {
      fontFamily: 'Pixelify_Sans',
      fontSize: 4 * scaleOfTheGame,
      color: '#000000',
      wordWrap: { width: 95 * scaleOfTheGame, useAdvancedWrap: true },
    };
    const boldTextStyle = {
      fontFamily: 'PixelifySans-Bold',
      fontSize: 4 * scaleOfTheGame,
      color: '#000000',
    };

    this.cvContent.cv.forEach((section, sectionIndex) => {
      const y = this.frameCoordinates[sectionIndex].y * scaleOfTheGame;
      const x = this.frameCoordinates[sectionIndex].x * scaleOfTheGame;

      let currentY = y;

      // Add title1 if it exists
      if (section.title1) {
        scene.add.text(
          x + 2.5 * scaleOfTheGame,
          currentY,
          section.title1,
          boldTextStyle
        );
        currentY += 5 * scaleOfTheGame; // Add spacing after title
      }

      // Add subTitle1 if it exists
      if (section.subTitle1) {
        scene.add.text(
          x + 2.5 * scaleOfTheGame,
          currentY,
          section.subTitle1,
          textStyle
        );
        currentY += 5 * scaleOfTheGame; // Add spacing after subtitle
      }

      // Add date if it exists
      if (section.date) {
        scene.add.text(
          x + 2.5 * scaleOfTheGame,
          currentY,
          section.date,
          textStyle
        );
        currentY += 5 * scaleOfTheGame; // Add spacing after date
      }

      // Display the logo if it exists
      if (section.picture) {
        const logo = scene.add.image(
          x + 2.5 * scaleOfTheGame,
          currentY,
          section.picture
        );
        logo.setOrigin(0, 0); // Position by the left edge
        logo.displayHeight = 12.5 * scaleOfTheGame; // Fixed height
        logo.scaleX = logo.scaleY; // Keep aspect ratio
        currentY += 15 * scaleOfTheGame; // Add spacing after logo
      }

      // Combine text and list if they exist
      let combinedText = section.text ? section.text + '\n\n' : '';
      if (section.list) {
        const combinedList = section.list
          .map((textObj) => `- ${textObj.text}`)
          .join('\n\n');
        combinedText += combinedList;
      }

      // Display the combined text
      if (combinedText) {
        scene.add.text(
          x + 2.5 * scaleOfTheGame,
          currentY,
          combinedText,
          textStyle
        );
      }
    });
  }
}
