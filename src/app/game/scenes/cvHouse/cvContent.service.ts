import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CvData } from '../../../models/cvData.enum';

@Injectable({
  providedIn: 'root',
})
export class CvContentService {
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

  constructor() {}

  /**
   *  Load picture in cvScene
   */
  loadPicture(scene: Phaser.Scene, cvData: CvData): void {
    cvData.cv.forEach((section) => {
      if (section.picture && section.pictureUrl) {
        scene.load.image(section.picture, section.pictureUrl);
      }
    });
  }

  displayTexts(
    scene: Phaser.Scene,
    scaleOfTheGame: number,
    cvData: CvData
  ): void {
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

    cvData.cv.forEach((section, sectionIndex) => {
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
