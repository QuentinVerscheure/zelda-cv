import { Injectable } from '@angular/core';
import { MovementService } from '../../core/movement.service';
import { CollisionService } from '../../core/collision.service';
import { PlayerService } from '../../core/player.service';
import { ValidAchievementService } from '../../core/valid-achievement.service';

@Injectable({
  providedIn: 'root'
})
export class SceneGuestBookService1 extends Phaser.Scene {

  private background!: Phaser.GameObjects.Image;
  private player!: Phaser.Physics.Arcade.Sprite;
  private scaleOfTheGame: number = 4;

  constructor(
    private movementService: MovementService,
    private collisionService: CollisionService,
    private playerService: PlayerService,
    private validAchievementService: ValidAchievementService,
  ) {
    super({ key: 'sceneGuestBook1' });
  }

  preload() {
    this.validAchievementService.ValidAchievement("guestBookHouse")

    this.load.image('Guest_Book_background', 'assets/game/Guest_Book_House_1.png');
    this.load.atlas(
      'linkDefault',
      'assets/game/Links_Default.png',
      'assets/game/Links_Default.json'
    );
    //load the collision between the background and the player
    this.load.json(
      'guestBookCollisionBackgroundData',
      'assets/game/guest_book_house_1_collision_background.json'
    );

    //load an invisible sprite for the hitbox detection for the change of scene
    this.load.image('sceneTransitionSprite', 'assets/game/hitbox.png');
    this.load.image('sceneTransitionSprite2', 'assets/game/hitbox.png');
  }

  create(data: { x: number; y: number; firstAnimationFrame: string }) {
    this.background = this.add.image(0, 0, 'Guest_Book_background');
    this.background.setOrigin(0, 0); // Origin top left
    this.background.setScale(this.scaleOfTheGame);

    //coordonate depanding of the scene transition
    const initialPlayerX =
      data?.x * this.scaleOfTheGame || 88 * this.scaleOfTheGame;
    const initialPlayerY =
      data?.y * this.scaleOfTheGame || 104 * this.scaleOfTheGame;
    const firstAnimationFrame =
      data?.firstAnimationFrame || 'walkingTop/frame0001';

    this.player = this.playerService.createPlayer(
      this.player,
      this,
      this.scaleOfTheGame,
      initialPlayerX,
      initialPlayerY,
      firstAnimationFrame
    );

    this.collisionService.createWorldCollisions(
      this,
      this.scaleOfTheGame,
      this.player,
      'guestBookCollisionBackgroundData'
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
      80,
      120,
      233,
      1507
    );

    this.collisionService.createSceneTransitionCollision(
      this,
      this.scaleOfTheGame,
      this.player,
      'sceneTransitionSprite',
      'sceneGuestBook2',
      80,
      0,
      224,
      1482
    );
  }

  override update() {
    MovementService.movePlayer(this.player, this.scaleOfTheGame);
  }
}
