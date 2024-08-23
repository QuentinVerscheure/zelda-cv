import { Injectable } from '@angular/core';
import {
  MoreElements,
  Picture,
  PortfolioDatas,
} from '../../../models/portfolioData.enum';
import { ScaleOfTheGameService } from '../../core/scale-of-the-game.service';

@Injectable({
  providedIn: 'root',
})
export class PortfolioContentService {
  private maxwidth: number = 100;
  private scaleOfTheGame: number = ScaleOfTheGameService.getScaleOfTheGame();

  //frame coordinate from top left to bottom right
  private frameCoordinates = [
    { x: 80, y: 672 },
    { x: 304, y: 672 },
    { x: 80, y: 400 },
    { x: 304, y: 400 },
    { x: 80, y: 128 },
    { x: 304, y: 128 },
  ];

  private textStyle = {
    fontFamily: 'Pixelify_Sans',
    fontSize: 4 * this.scaleOfTheGame,
    color: '#000000',
    wordWrap: {
      width: this.maxwidth * this.scaleOfTheGame,
      useAdvancedWrap: true,
    },
  };
  private textStyleWhite = {
    fontFamily: 'Pixelify_Sans',
    fontSize: 4 * this.scaleOfTheGame,
    color: '#FFFFFF',
  };
  private boldTextStyle = {
    fontFamily: 'PixelifySans-Bold',
    fontSize: 6 * this.scaleOfTheGame,
    color: '#000000',
  };

  constructor() {}

  /**
   * Load picture in portfolioContent
   */
  loadPicturePortfolio1(
    scene: Phaser.Scene,
    PortfolioData: PortfolioDatas
  ): void {
    PortfolioData.portfolio.forEach((section) => {
      // Check if section has a picture before trying to load it
      if (section) {
        if (section.picture) {
          scene.load.image(
            section.picture.pictureName,
            section.picture.pictureUrl
          );
        }

        // Load pictures in the 'main' section if it exists
        if (section.main) {
          section.main.forEach((main) => {
            if (this.isPicture(main) && main.picture) {
              scene.load.image(
                main.picture.pictureName,
                main.picture.pictureUrl
              );
            }
          });
        }
      }
    });
  }

  /**
   * Load picture in portfolioContent2
   */
  loadPicturePortfolio2(
    scene: Phaser.Scene,
    moreElement: MoreElements[]
  ): void {
    moreElement.forEach((section) => {
      if (section.picture) {
        scene.load.image(
          section.picture.pictureName,
          section.picture.pictureUrl
        );
      }
    });
  }

  /**
   * Displays the portfolio2 content .
   */
  displayPortfolio2(
    scene: Phaser.Scene,
    scaleOfTheGame: number,
    MoreElements: MoreElements[]
  ): void {
    MoreElements.forEach((moreElement) => {
      let y = moreElement.yOffset * this.scaleOfTheGame;
      const x = moreElement.xOffset * this.scaleOfTheGame;

      if (moreElement.picture) {
        const picture = scene.add.image(
          x * this.scaleOfTheGame,
          y,
          moreElement.picture.pictureName
        );
        picture.setOrigin(0, 0); // Position by the left edge
        picture.displayHeight =
          moreElement.picture.pictureSize * this.scaleOfTheGame; // Fixed height
        picture.scaleX = picture.scaleY; // Keep aspect ratio
      } else if (moreElement.text) {
        moreElement.text.forEach((text) => {
          scene.add.text(x * this.scaleOfTheGame, y, text, this.textStyleWhite);
          y += 5 * this.scaleOfTheGame;
        });
      }
    });
  }

  /**
   * Displays the portfolio content on the scene.
   */
  displayPortfolio(scene: Phaser.Scene, PortfolioData: PortfolioDatas): void {
    if (!PortfolioData) {
      console.log('no cvContent loaded');
      return; // Ensure texts are loaded before trying to display them
    }

    PortfolioData.portfolio.forEach((section, sectionIndex) => {
      if (section) {
        const y = this.frameCoordinates[sectionIndex].y * this.scaleOfTheGame;
        const x = this.frameCoordinates[sectionIndex].x * this.scaleOfTheGame;

        let currentY = y;

        // Add title1 if it exists
        if (section.title1) {
          const titleText = scene.add.text(
            x + 2.5 * this.scaleOfTheGame,
            currentY,
            section.title1,
            {
              ...this.boldTextStyle,
              wordWrap: {
                width: this.maxwidth * this.scaleOfTheGame,
                useAdvancedWrap: true,
              },
            }
          );

          currentY += titleText.height + 4 * this.scaleOfTheGame; // Adjust spacing after title
        }

        // Add subTitle1 if it exists
        if (section.subTitle1) {
          const subtitleText = scene.add.text(
            x + 2.5 * this.scaleOfTheGame,
            currentY,
            section.subTitle1,
            {
              ...this.textStyle,
              wordWrap: {
                width: this.maxwidth * this.scaleOfTheGame,
                useAdvancedWrap: true,
              },
            }
          );
          currentY += subtitleText.height + 4 * this.scaleOfTheGame; // Add spacing after subtitle
        }

        // Add date if it exists
        if (section.date) {
          scene.add.text(
            x + 2.5 * this.scaleOfTheGame,
            currentY,
            section.date,
            this.textStyle
          );
          currentY += 7 * this.scaleOfTheGame; // Add spacing after date
        }

        // Display the main content
        if (section.main) {
          section.main.forEach((main) => {
            if (typeof main.text === 'string') {
              const textObject = scene.add.text(
                x + 2.5 * this.scaleOfTheGame,
                currentY,
                main.text,
                {
                  ...this.textStyle,
                  wordWrap: {
                    width: this.maxwidth * this.scaleOfTheGame,
                    useAdvancedWrap: true,
                  },
                }
              );
              currentY += textObject.height + 2 * this.scaleOfTheGame;
            } else if (this.isPicture(main) && main.picture) {
              const image = scene.add.image(
                x + 2.5 * this.scaleOfTheGame,
                currentY,
                main.picture.pictureName
              );
              image.setOrigin(0, 0);
              image.displayHeight =
                main.picture.pictureSize * this.scaleOfTheGame;
              image.scaleX = image.scaleY;
              currentY +=
                (main.picture.pictureSize + 2.5) * this.scaleOfTheGame;

              // Check if the picture has a downloadLink
              if (main.picture.downloadLink) {
                // Set the image as interactive
                image.setInteractive({ useHandCursor: true });
                image.on('pointerdown', () => {
                  const link = document.createElement('a');
                  if (main.picture.downloadLink) {
                    link.href = main.picture.downloadLink;
                    link.download = ''; // Setting download attribute with an empty string to prompt the user to save the file with its original name
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }
                });
                // Check if the picture has a link
              } else if (main.picture.pictureLink) {
                image.setInteractive({ useHandCursor: true });
                image.on('pointerdown', () => {
                  window.open(main.picture.pictureLink, '_blank');
                });
              }
            }
          });
        }
      }
    });
  }

  createKeyBlock(
    scene: Phaser.Scene,
    player: Phaser.Physics.Arcade.Sprite,
    PortfolioData: PortfolioDatas
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
        if (section) {
          // Check if the "more" field is missing or empty
          if (!section.more || section.more.length === 0) {
            // Get the coordinates from keyBlockCoordinate based on the index
            const coordinates = keyBlockCoordinate[index];

            const keyblock = scene.physics.add.sprite(
              this.scaleOfTheGame * coordinates.x,
              this.scaleOfTheGame * coordinates.y,
              'keyBlock'
            );
            keyblock.setScale(this.scaleOfTheGame);
            keyblock.body.immovable = true;

            // Add collider between the player and the keylock
            scene.physics.add.collider(player, keyblock);
          }
        }
      });
    }
  }

  // Type guard function to check if an object is a Picture
  isPicture(object: any): object is { picture: Picture } {
    return object.picture !== undefined;
  }
}
