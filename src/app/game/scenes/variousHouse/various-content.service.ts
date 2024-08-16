import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { VariousContentConfig } from '../../../models/various_Box.enum';
import * as yaml from 'js-yaml';

@Injectable({
  providedIn: 'root',
})
export class VariousContentService {
  private configUrl = 'assets/texts/various_content.yaml';

  constructor(private http: HttpClient) {}

  getContentConfig(): Observable<VariousContentConfig> {
    return this.http.get(this.configUrl, { responseType: 'text' }).pipe(
      map((yamlText: string) => {
        return yaml.load(yamlText) as VariousContentConfig;
      })
    );
  }

  createBox(scene: Phaser.Scene, scaleOfTheGame: number, config: VariousContentConfig): void {
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

    // Creation of titles and elements based on YAML data
    config.boxes.forEach((box) => {
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
