import { Injectable } from '@angular/core';
import { MovementService } from '../../core/movement.service';
import { CollisionService } from '../../core/collision.service';
import { PlayerService } from '../../core/player.service';
import { ValidAchievementService } from '../../core/valid-achievement.service';

@Injectable({
  providedIn: 'root',
})
export class SceneContactService extends Phaser.Scene {
  private background!: Phaser.GameObjects.Image;
  private player!: Phaser.Physics.Arcade.Sprite;
  private scaleOfTheGame: number = 4;

  constructor(
    private movementService: MovementService,
    private collisionService: CollisionService,
    private playerService: PlayerService,
    private validAchievementService: ValidAchievementService,
  ) {
    super({ key: 'sceneContact' });
  }

  preload() {
    this.validAchievementService.ValidAchievement("contactHouse")
    
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

    this.load.image('openBook', 'assets/game/open_book.png');

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

    if (this.input.keyboard) {
      MovementService.initializeKeyboardInput(this.input);
    }

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

    //create the clickable book who display the contact form
    const openBook = this.createClickableBook(95, 90, this.scaleOfTheGame, this.player);
    
  }

  override update() {
    MovementService.movePlayer(this.player, this.scaleOfTheGame);
  }

  createClickableBook(x: number, y: number, scaleOfTheGame: number, player: Phaser.Physics.Arcade.Sprite) {
    const openBook = this.physics.add.sprite(
      scaleOfTheGame * x,
      scaleOfTheGame * y,
      'openBook'
    );
    openBook.setScale(scaleOfTheGame);
    openBook.setInteractive({ useHandCursor: true });
    openBook.body.immovable = true;

    openBook.on('pointerdown', () => {
      console.log('ouvre le formulaire');
    });

    this.physics.add.collider(player, openBook);

    return openBook;
  }
}
