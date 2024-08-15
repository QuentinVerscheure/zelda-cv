import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface BoxElement {
  type: 'text' | 'image';
  text?: string;
  key?: string;
  xOffset: number;
  yOffset: number;
  height?: number;
}

interface Box {
  title: string;
  x: number;
  y: number;
  elements: BoxElement[];
}

interface VariousContentConfig {
  boxes: Box[];
}

@Injectable({
  providedIn: 'root',
})
export class VariousContentService {
  private configUrl = 'assets/game/texts/various_content.json';

  constructor(private http: HttpClient) {}

  getContentConfig(): Observable<VariousContentConfig> {
    return this.http.get<VariousContentConfig>(this.configUrl);
  }

  createBox(scene: Phaser.Scene, scaleOfTheGame: number, config: VariousContentConfig): void {
    const textStyle = {
      fontFamily: 'Pixelify_Sans',
      fontSize: 4 * scaleOfTheGame,
      color: '#000000',
    };
    const boldTextStyle = {
      fontFamily: 'PixelifySans-Bold',
      fontSize: 5 * scaleOfTheGame,
      color: '#000000',
    };

    // Creation of titles and elements based on JSON data
    config.boxes.forEach((box) => {
      const x = box.x * scaleOfTheGame;
      const y = box.y * scaleOfTheGame;

      if (box.title) {
        scene.add.rectangle(
          x + (39.6 * scaleOfTheGame),
          y + (12.4 * scaleOfTheGame),
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
