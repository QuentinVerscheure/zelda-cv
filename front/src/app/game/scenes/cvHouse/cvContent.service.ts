import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CvData } from '../../../models/cvData.model';

@Injectable({
  providedIn: 'root',
})
export class CvContentService {
  //frame coordinate from top left to bottom right, do not change if you have not change the bakground .png
  // 1 2 3 4
  // 5 6 7 8
  private frameCoordinates = [
    { x: 96, y: 50 }, //1
    { x: 320, y: 50 }, //2
    { x: 560, y: 50 }, //3
    { x: 785, y: 50 }, //4
    { x: 96, y: 305 }, //5
    { x: 320, y: 305 }, //6
    { x: 560, y: 305 }, //7
    { x: 785, y: 305 }, //8
  ];

  constructor() {}

  /**
   *  Load picture in Scene
   * @param cvData - content of the yaml file with all information to display
   */
  loadPicture(scene: Phaser.Scene, cvData: CvData): void {
    cvData.cv.forEach((section) => {
      if (section.picture && section.pictureUrl) {
        scene.load.image(section.picture, section.pictureUrl);
      }
    });
  }

  /**
   *  display text in the scene
   * @param cvData - content of the yaml file with all information to display
   */
  displayTexts(
    scene: Phaser.Scene,
    scaleOfTheGame: number,
    cvData: CvData
  ): void {
    const baseTextStyle = {
      fontFamily: 'ShareTechMono-Regular',
      fontSize: 4.5 * scaleOfTheGame,
      color: '#000000',
    };
    const textStyle = {
      ...baseTextStyle,
      wordWrap: { width: 120 * scaleOfTheGame, useAdvancedWrap: true },
    };
    const listTextStyle = { //because list items have tabulation
      ...baseTextStyle,
      wordWrap: { width: 113 * scaleOfTheGame, useAdvancedWrap: true },
    };
    const boldTextStyle = {
      fontFamily: 'PixelifySans-Bold',
      fontSize: 5 * scaleOfTheGame,
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
        currentY += 7 * scaleOfTheGame; // Add spacing after title
      }

      // Add subTitle1 if it exists
      if (section.subTitle1) {
        scene.add.text(
          x + 3 * scaleOfTheGame,
          currentY,
          section.subTitle1,
          textStyle
        );
        currentY += 5 * scaleOfTheGame; // Add spacing after subtitle
      }

      // Add date if it exists
      if (section.date) {
        scene.add.text(
          x + 4 * scaleOfTheGame,
          currentY,
          section.date,
          textStyle
        );
        currentY += 5 * scaleOfTheGame; // Add spacing after date
      }

      // Display the logo if it exists
      if (section.picture) {
        const logo = scene.add.image(
          x + 3 * scaleOfTheGame,
          currentY + 10,
          section.picture
        );
        logo.setOrigin(0, 0); // Position by the left edge
        logo.displayHeight = 12.5 * scaleOfTheGame; // Fixed height
        logo.scaleX = logo.scaleY; // Keep aspect ratio
        currentY += 18 * scaleOfTheGame; // Add spacing after logo
      }

      // Display main text if it exists
      if (section.text) {
        const textObj = scene.add.text(
          x + 3 * scaleOfTheGame,
          currentY,
          section.text,
          textStyle
        );
        currentY += textObj.height + 5 * scaleOfTheGame; // Add spacing after main text based on its height
      }

      // Display list if it exists
      if (section.list) {
        let listY = currentY;
        section.list.forEach((textObj) => {
          const item = scene.add.text(
            x + 10 * scaleOfTheGame,
            listY,
            `\t- ${textObj.text}`,
            listTextStyle
          );
          listY += item.height + 3 * scaleOfTheGame; 
        });
      }
    });
  }
}
