import { Injectable } from '@angular/core';
import {
  Picture,
  PortfolioData,
} from '../../../models/portfolioData.enum';

@Injectable({
  providedIn: 'root',
})
export class PortfolioContentService {
  private maxwidth: number = 100;

  //frame coordinate from top left to bottom right
  private frameCoordinates = [
    { x: 80, y: 672 },
    { x: 304, y: 672 },
    { x: 80, y: 400 },
    { x: 304, y: 400 },
    { x: 80, y: 128 },
    { x: 304, y: 128 },
  ];

  constructor() {}

  /**
   * Load picture in portfolioContent
   */
  loadPicture(scene: Phaser.Scene, PortfolioData: PortfolioData): void {
    PortfolioData.portfolio.forEach((section) => {
      // Load the main picture for the portfolio section
      if (section.picture) {
        scene.load.image(
          section.picture.pictureName,
          section.picture.pictureUrl
        );
      }

      // Load pictures in the 'main' section if it exists
      if (section.main) {
        section.main.forEach((main) => {
          if (this.isPicture(main)) {
            scene.load.image(main.picture.pictureName, main.picture.pictureUrl);
          }
        });
      }
    });
  }

  /**
   * Displays the portfolio content on the scene.
   */
  displayPortfolio(scene: Phaser.Scene, scaleOfTheGame: number, PortfolioData: PortfolioData): void {
    if (!PortfolioData) {
      console.log('no cvContent loaded');
      return; // Ensure texts are loaded before trying to display them
    }

    const textStyle = {
      fontFamily: 'Pixelify_Sans',
      fontSize: 4 * scaleOfTheGame,
      color: '#000000',
      wordWrap: {
        width: this.maxwidth * scaleOfTheGame,
        useAdvancedWrap: true,
      },
    };
    const boldTextStyle = {
      fontFamily: 'PixelifySans-Bold',
      fontSize: 6 * scaleOfTheGame,
      color: '#000000',
    };

    PortfolioData.portfolio.forEach((section, sectionIndex) => {
      const y = this.frameCoordinates[sectionIndex].y * scaleOfTheGame;
      const x = this.frameCoordinates[sectionIndex].x * scaleOfTheGame;

      let currentY = y;

      // Add title1 if it exists
      if (section.title1) {
        const titleText = scene.add.text(
          x + 2.5 * scaleOfTheGame,
          currentY,
          section.title1,
          {
            ...boldTextStyle,
            wordWrap: {
              width: this.maxwidth * scaleOfTheGame, // Set the maximum width for wrapping
              useAdvancedWrap: true, // Enables advanced word wrapping
            },
          }
        );

        // Update currentY based on the height of the added text to ensure proper spacing
        currentY += titleText.height + 5 * scaleOfTheGame; // Adjust spacing after title
      }

      // Add subTitle1 if it exists
      if (section.subTitle1) {
        scene.add.text(
          x + 2.5 * scaleOfTheGame,
          currentY,
          section.subTitle1,
          textStyle
        );
        currentY += 7 * scaleOfTheGame; // Add spacing after subtitle
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

      // Display the picture if it exists
      if (section.picture) {
        const picture = scene.add.image(
          x + 2.5 * scaleOfTheGame,
          currentY,
          section.picture.pictureName
        );
        picture.setOrigin(0, 0); // Position by the left edge
        picture.displayHeight = section.picture.pictureSize * scaleOfTheGame; // Fixed height
        picture.scaleX = picture.scaleY; // Keep aspect ratio
        currentY += (section.picture.pictureSize + 2.5) * scaleOfTheGame; // Add spacing after logo
      }

      // Display the main content
      if (section.main) {
        section.main.forEach((main) => {
          if (typeof main.text === 'string') {
            // If main.text is a string, display it as a text element
            const textObject = scene.add.text(
              x + 2.5 * scaleOfTheGame,
              currentY,
              main.text, // Access text from the object
              {
                ...textStyle,
                wordWrap: {
                  width: this.maxwidth * scaleOfTheGame,
                  useAdvancedWrap: true,
                },
              } // Set max width and wrap options
            );

            // Update currentY based on the height of the added text to ensure proper spacing
            currentY += textObject.height + 2 * scaleOfTheGame;
          } else if (this.isPicture(main)) {
            // If main is of type Picture, display the picture
            const image = scene.add.image(
              x + 2.5 * scaleOfTheGame,
              currentY,
              main.picture.pictureName // Access pictureName from the object
            );

            image.setOrigin(0, 0); // Align the image to the top-left
            image.displayHeight = main.picture.pictureSize * scaleOfTheGame; // Set fixed height
            image.scaleX = image.scaleY; // Maintain aspect ratio

            // Update currentY based on the height of the added image to ensure proper spacing
            currentY += (main.picture.pictureSize + 2.5) * scaleOfTheGame;
          }
        });
      }
    });
  }

  createKeyBlock(
    scene: Phaser.Scene,
    scaleOfTheGame: number,
    player: Phaser.Physics.Arcade.Sprite,
    PortfolioData: PortfolioData
  ) {
    // Example structure of keyBlockCoordinate, you can modify it based on actual coordinates
    const keyBlockCoordinate = [
      { x: 40, y: 744 },
      { x: 456, y: 744 },
      { x: 40, y: 472 },
      { x: 456, y: 472 },
      { x: 40, y: 200 },
      { x: 456, y: 200 },
    ];

    //add keylock if no "more" content is available for a portfolio section

    // Iterate over each portfolio section and corresponding coordinates
    if (PortfolioData) {
      PortfolioData.portfolio.forEach((section, index) => {
        // Check if the "more" field is missing or empty
        if (!section.more || section.more.length === 0) {
          // Get the coordinates from keyBlockCoordinate based on the index
          const coordinates = keyBlockCoordinate[index];

          const keyblock = scene.physics.add.sprite(
            scaleOfTheGame * coordinates.x,
            scaleOfTheGame * coordinates.y,
            'keyBlock'
          );
          keyblock.setScale(scaleOfTheGame);
          keyblock.body.immovable = true;

          // Add collider between the player and the keylock
          scene.physics.add.collider(player, keyblock);
        }
      });
    }
  }

  // Type guard function to check if an object is a Picture
  isPicture(object: any): object is { picture: Picture } {
    return object.picture !== undefined;
  }
}
