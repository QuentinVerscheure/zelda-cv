import { Injectable } from '@angular/core';
import { MovementService } from '../../core/movement.service';
import { CollisionService } from '../../core/collision.service';
import { PlayerService } from '../../core/player.service';
import { ValidAchievementService } from '../../core/valid-achievement.service';
import { ScaleOfTheGameService } from '../../core/scale-of-the-game.service';

@Injectable({
  providedIn: 'root',
})
export class SceneContactService extends Phaser.Scene {
  private background!: Phaser.GameObjects.Image;
  private player!: Phaser.Physics.Arcade.Sprite;
  private scaleOfTheGame: number = ScaleOfTheGameService.getScaleOfTheGame();

  constructor(
    private movementService: MovementService,
    private collisionService: CollisionService,
    private playerService: PlayerService,
    private validAchievementService: ValidAchievementService
  ) {
    super({ key: 'sceneContact' });
  }

  preload() {
    this.validAchievementService.ValidAchievement('contactHouse');

    this.load.image(
      'phoneHouse_background',
      'assets/game/Phone_House_Background.png'
    );

    //load the collision between the background and the player
    this.load.json(
      'phoneHouseCollisionBackgroundData',
      'assets/game/phone_house_collision_background.json'
    );

    //load an invisible sprite for the hitbox detection for the change of scene
    this.load.image('sceneTransitionSprite', 'assets/game/hitbox.png');

    this.load.image('message', 'assets/game/message.png');

    this.load.atlas(
      'linkDefault',
      'assets/game/Links_Default.png',
      'assets/game/Links_Default.json'
    );
  }

  create() {
    this.background = this.add.image(0, 0, 'phoneHouse_background');
    this.background.setOrigin(0, 0); // Origin top left
    this.background.setScale(this.scaleOfTheGame);

    const initialPlayerX = 97 * this.scaleOfTheGame; // Set your desired initial X position
    const initialPlayerY = 232 * this.scaleOfTheGame; // Set your desired initial Y position

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
      'phoneHouseCollisionBackgroundData'
    );

    this.movementService.initializeInput(this);

    this.collisionService.createSceneTransitionCollision(
      this,
      this.scaleOfTheGame,
      this.player,
      'sceneTransitionSprite',
      'sceneWorld',
      88,
      246,
      410,
      1490
    );

    //create the clickable icon who display the contact form
    this.createSendMailIcon(95, 90, this.scaleOfTheGame, this.player);
  }

  override update() {
    this.movementService.movePlayer(this.player, this.scaleOfTheGame);
  }

  createSendMailIcon(
    x: number,
    y: number,
    scaleOfTheGame: number,
    player: Phaser.Physics.Arcade.Sprite
  ) {
    const icon = this.physics.add.sprite(
      scaleOfTheGame * x,
      scaleOfTheGame * y,
      'message'
    );
    icon.setScale(scaleOfTheGame);
    icon.setInteractive({ useHandCursor: true });
    icon.body.immovable = true;

    icon.on('pointerdown', () => {
      this.validAchievementService.ValidAchievement('contactMe');
      this.showForm();
    });

    this.physics.add.collider(player, icon);

    return icon;
  }

  showForm() {
    const form = document.getElementById('contact-container');
    if (form) {
      form.classList.remove('hidden');
    }
  }
}
