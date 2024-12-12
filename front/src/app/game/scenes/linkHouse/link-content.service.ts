import { Injectable } from '@angular/core';
import { LinkData, LinkPictureContent } from '../../../models/linkData.enum';
import { ValidAchievementService } from '../../core/valid-achievement.service';

@Injectable({
  providedIn: 'root',
})
export class LinkContentService {
  constructor(private validAchievementService: ValidAchievementService) {}

  /**
   *  Load picture in linkScene
   */
  loadPicture(scene: Phaser.Scene, linkData: LinkData): void {
    linkData.link.forEach((section) => {
      scene.load.image(section.picture.pictureName, section.picture.pictureUrl);
    });
  }

  displayContent(
    scene: Phaser.Scene,
    linkData: LinkData,
    scaleOfTheGame: number
  ): void {
    linkData.link.forEach((section) => {
      this.createPicture(
        scene,
        section.picture.x,
        section.picture.y,
        section.picture.pictureSize,
        section.picture.pictureName,
        section.picture.pictureLink,
        scaleOfTheGame
      );
    });
  }

  createPicture(
    scene: Phaser.Scene,
    x: number,
    y: number,
    scale: number,
    picture: string,
    url: string,
    scaleOfTheGame: number
  ) {
    const pictureSprite = scene.add.image(
      scaleOfTheGame * x,
      scaleOfTheGame * y,
      picture
    );
    pictureSprite.setScale(scale * scaleOfTheGame);

    pictureSprite.setInteractive({ useHandCursor: true });

    pictureSprite.on('pointerdown', () => {
      this.validAchievementService.ValidAchievement('linkClicked');
      window.open(url, '_blank');
    });
  }
}
