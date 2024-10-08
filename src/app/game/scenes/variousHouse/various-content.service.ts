import { Injectable } from '@angular/core';
import { VariousContentConfig } from '../../../models/various_Data.enum';

@Injectable({
  providedIn: 'root',
})
export class VariousContentService {
  constructor() {}

  /**
   * create the content of boxes in various scene
   * @param variousData - pictures and texts to display in various scene from the yaml file
   */
  createBox(
    scene: Phaser.Scene,
    scaleOfTheGame: number,
    variousData: VariousContentConfig
  ): void {
    const textStyle = {
      fontFamily: 'Pixelify_Sans',
      fontSize: 4 * scaleOfTheGame,
      color: '#000000',
      wordWrap: { width: 60 * scaleOfTheGame }, // Adjust this value according to your needs
    };
    const boldTextStyle = {
      fontFamily: 'PixelifySans-Bold',
      fontSize: 5 * scaleOfTheGame,
      color: '#000000',
      wordWrap: { width: 60 * scaleOfTheGame }, // Same for bold text
    };

    // Creation of titles and elements based on file data
    if (variousData) {
      variousData.boxes.forEach((box) => {
        const x = box.x * scaleOfTheGame;
        const y = box.y * scaleOfTheGame;

        if (box.title) {
          scene.add.rectangle(
            x + 39.6 * scaleOfTheGame,
            y + 12.4 * scaleOfTheGame,
            62 * scaleOfTheGame,
            8 * scaleOfTheGame,
            0xffffff
          );

          scene.add.text(
            x + 10 * scaleOfTheGame,
            y + 10 * scaleOfTheGame,
            box.title,
            boldTextStyle
          );
        }

        box.elements.forEach((element) => {
          if (element.type === 'text') {
            scene.add.text(
              x + element.xOffset * scaleOfTheGame,
              y + element.yOffset * scaleOfTheGame,
              element.text!,
              textStyle
            );
          } else if (element.type === 'image') {
            const img = scene.add.image(
              x + element.xOffset * scaleOfTheGame,
              y + element.yOffset * scaleOfTheGame,
              element.key!
            );
            img.setOrigin(0, 0);
            img.displayHeight = element.height! * scaleOfTheGame;
            img.scaleX = img.scaleY;
          }
        });
      });
    }
  }
}
