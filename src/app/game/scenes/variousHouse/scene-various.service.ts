import { Injectable } from '@angular/core';
import { CollisionService } from '../../core/collision.service';
import { MovementService } from '../../core/movement.service';
import { PlayerService } from '../../core/player.service';
import { VariousContentService } from './various-content.service';
import { ValidAchievementService } from '../../core/valid-achievement.service';
import { ScaleOfTheGameService } from '../../core/scale-of-the-game.service';
import { VariousContentConfig } from '../../../models/various_Data.enum';
import { HousesDataService } from '../../core/houses-data.service';

@Injectable({
  providedIn: 'root',
})
export class SceneVariousService extends Phaser.Scene {
  private background!: Phaser.GameObjects.Image;
  private player!: Phaser.Physics.Arcade.Sprite;
  private scaleOfTheGame: number = ScaleOfTheGameService.getScaleOfTheGame();
  private variousData: VariousContentConfig | undefined;

  constructor(
    private movementService: MovementService,
    private collisionService: CollisionService,
    private playerService: PlayerService,
    private variousContentService: VariousContentService,
    private validAchievementService: ValidAchievementService,
    private housesDataService: HousesDataService
  ) {
    super({ key: 'sceneVarious' });
  }

  preload() {
    this.validAchievementService.ValidAchievement('variousHouse');

    this.load.image(
      'various_house_background',
      'assets/game/various_house.png'
    );

    //load the collision between the background and the player
    this.load.json(
      'variousCollisionBackground',
      'assets/game/various_collision_background.json'
    );

    //load an invisible sprite for the hitbox detection for the change of scene
    this.load.image('sceneTransitionSprite', 'assets/game/hitbox.png');

    this.load.atlas(
      'linkDefault',
      'assets/game/Links_Default.png',
      'assets/game/Links_Default.json'
    );

    // Load pictures use in the portfolio content
    this.variousData = this.housesDataService.getVariousData();
    if (this.variousData) {
      this.variousData.boxes.forEach((box) => {
        box.elements.forEach((element) => {
          if (element.type === 'image' && element.pictureUrl && element.key) {
            // Charger l'image en utilisant la clé et l'URL spécifiées dans le YAML
            this.load.image(element.key, element.pictureUrl);
          }
        });
      });
    } else {
      console.log('error, variousData not load from file');
    }
  }

  create() {
    this.background = this.add.image(0, 0, 'various_house_background');
    this.background.setOrigin(0, 0); // Origin top left
    this.background.setScale(this.scaleOfTheGame);

    const initialPlayerX = 200 * this.scaleOfTheGame; // Set your desired initial X position
    const initialPlayerY = 250 * this.scaleOfTheGame; // Set your desired initial Y position

    // this.variousContentService.loadTexts(this, this.scaleOfTheGame);

    this.player = this.playerService.createPlayer(
      this.player,
      this,
      this.scaleOfTheGame,
      initialPlayerX,
      initialPlayerY,
      'walkingTop/frame0001'
    );

    this.collisionService.createWorldCollisions(
      this,
      this.scaleOfTheGame,
      this.player,
      'variousCollisionBackground'
    );

    MovementService.initializeInput(this);

    this.collisionService.createSceneTransitionCollision(
      this,
      this.scaleOfTheGame,
      this.player,
      'sceneTransitionSprite',
      'sceneWorld',
      192,
      266,
      217,
      1350
    );

    

    if (this.variousData) {
      this.variousContentService.createBox(this, this.scaleOfTheGame, this.variousData);
    } else {
      console.log('error, variousData not load from file');
    }
  }

  override update() {
    MovementService.movePlayer(this.player, this.scaleOfTheGame);
  }
}
