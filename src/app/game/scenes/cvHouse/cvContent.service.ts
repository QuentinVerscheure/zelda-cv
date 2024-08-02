import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CvContent } from '../../../models/Cv_content.enum';
@Injectable({
  providedIn: 'root',
})
export class CvContentService {
  private cvContentUrl: string = 'assets/game/texts/CV_content.json';
  private cvContent: CvContent | undefined;

  //framecoordinate from top left to bottm right
  private frameCoordinates = [
    {
      x: 112,
      y: 48,
    },
    {
      x: 320,
      y: 48,
    },
    {
      x: 528,
      y: 48,
    },
    {
      x: 736,
      y: 48,
    },
    {
      x: 112,
      y: 272,
    },
    {
      x: 320,
      y: 272,
    },
    {
      x: 528,
      y: 272,
    },
    {
      x: 736,
      y: 272,
    },
  ];

  constructor(private http: HttpClient) {}

  /**
   *  Load and display the content of the CV frames
   */
  loadTexts(scene: Phaser.Scene, scaleOfTheGame: number): void {
    this.getCvContent().subscribe((data: CvContent) => {
      this.cvContent = data;
      this.displayTexts(scene, this.cvContent, scaleOfTheGame);
    });
  }

  getCvContent(): Observable<CvContent> {
    return this.http.get<CvContent>(this.cvContentUrl);
  }

  displayTexts(
    scene: Phaser.Scene,
    cvContent: CvContent,
    scaleOfTheGame: number
  ): void {
    if (!cvContent) {
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
      fontSize: 4* scaleOfTheGame,
      color: '#000000',
    };

    cvContent.cv.forEach((section, sectionIndex) => {
      const y = this.frameCoordinates[sectionIndex].y * scaleOfTheGame;
      const x = this.frameCoordinates[sectionIndex].x * scaleOfTheGame;

      if (section.title1) {
        scene.add.text(x + (2.5*scaleOfTheGame), y + (2.5*scaleOfTheGame), section.title1, boldTextStyle);
      }
      if (section.subTitle1) {
        scene.add.text(x + (6.25*scaleOfTheGame), y + (7.5*scaleOfTheGame), section.subTitle1, textStyle);
      }
      if (section.date) {
        scene.add.text(x + (6.25*scaleOfTheGame), y + (12.5*scaleOfTheGame), section.date, textStyle);
      }

      //display the logo
      const logo = scene.add.image(x + (6.25*scaleOfTheGame), y + (20*scaleOfTheGame), section.logo);
      logo.setOrigin(0, 0); // Positionner par le bord gauche
      logo.displayHeight = (12.5*scaleOfTheGame); // Taille fixe en longueur
      logo.scaleX = logo.scaleY; // Laisser libre en largeur

      scene.add.text(x + (6.25*scaleOfTheGame), y + (12.5*scaleOfTheGame), section.date, textStyle);

      //display text + all list.text
      let combinedText = section.text ? section.text + '\n\n' : '';
      if (section.list) {
        const combinedList = section.list
          .map((textObj) => `- ${textObj.text}`)
          .join('\n\n');
        combinedText += combinedList;
      }

      if (combinedText) {
        scene.add.text(x + (2.5*scaleOfTheGame), y + (37.5*scaleOfTheGame), combinedText, textStyle);
      }
    });
  }
}
