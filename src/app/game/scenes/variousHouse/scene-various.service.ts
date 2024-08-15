import { Injectable } from '@angular/core';
import { CollisionService } from '../../core/collision.service';
import { MovementService } from '../../core/movement.service';
import { PlayerService } from '../../core/player.service';
import { VariousContentService } from './various-content.service';
import { ValidAchievementService } from '../../core/valid-achievement.service';
import { ScaleOfTheGameService } from '../../core/scale-of-the-game.service';

@Injectable({
  providedIn: 'root',
})
export class SceneVariousService extends Phaser.Scene {
  private background!: Phaser.GameObjects.Image;
  private player!: Phaser.Physics.Arcade.Sprite;
  private scaleOfTheGame: number = ScaleOfTheGameService.getScaleOfTheGame();

  constructor(
    private movementService: MovementService,
    private collisionService: CollisionService,
    private playerService: PlayerService,
    private variousContentService: VariousContentService,
    private validAchievementService: ValidAchievementService
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

    this.load.image('science', 'assets/game/science.png');
    this.load.image('3d', 'assets/game/3d.png');
    this.load.image('computer', 'assets/game/computer.png');
    this.load.image('english_flag', 'assets/game/english_flag.png');
    this.load.image('french_flag', 'assets/game/french_flag.png');
    this.load.image('mobility', 'assets/game/mobility.png');
    this.load.image('phone', 'assets/logo/phone.png');
    this.load.image('mail', 'assets/logo/mail.png');

    //load an invisible sprite for the hitbox detection for the change of scene
    this.load.image('sceneTransitionSprite', 'assets/game/hitbox.png');

    this.load.atlas(
      'linkDefault',
      'assets/game/Links_Default.png',
      'assets/game/Links_Default.json'
    );
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

    this.variousContentService.getContentConfig().subscribe(config => {
      this.variousContentService.createBox(this, this.scaleOfTheGame, config);
    });
  }

  override update() {
    MovementService.movePlayer(this.player, this.scaleOfTheGame);
  }
}
