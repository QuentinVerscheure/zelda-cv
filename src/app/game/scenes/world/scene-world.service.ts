import { Injectable } from '@angular/core';
import { MovementService } from '../../core/movement.service';
import { WallCollisionService } from '../../core/wall-collision.service';
import { PlayerService } from '../../core/player.service';

@Injectable({
  providedIn: 'root',
})
export class SceneWorldService extends Phaser.Scene {
  private background!: Phaser.GameObjects.Image;
  private player!: Phaser.Physics.Arcade.Sprite;
  private scaleOfTheGame: number = 2;

  constructor(
    private movementService: MovementService,
    private wallCollisionService: WallCollisionService,
    private playerService: PlayerService
  ) {
    super({ key: 'sceneWorld' });
  }

  preload() {
    this.load.image('worldBackground', 'assets/game/Koholint.png');
    this.load.atlas(
      'linkDefault',
      'assets/game/Links_Default.png',
      'assets/game/Links_Default.json'
    );
    //load the collision between the background and the player
    this.load.json(
      'KoholintCollisionBackgroundData',
      'assets/game/Koholint_collision_background.json'
    ); //background collision map file

    //load an invisible sprite for the hitbox detection for the change of scene
    this.load.image('invisibleSprite', 'assets/game/hitbox.png');
  }

  create() {
    this.background = this.add.image(0, 0, 'worldBackground');
    this.background.setOrigin(0, 0); // Origin top left
    this.background.setScale(this.scaleOfTheGame);

    const initialPlayerX = 408 * this.scaleOfTheGame; // Set your desired initial X position
    const initialPlayerY = 1378 * this.scaleOfTheGame; // Set your desired initial Y position

    this.player = this.playerService.createPlayer(
      this.player,
      this,
      this.scaleOfTheGame,
      initialPlayerX,
      initialPlayerY,
      'walkingRight/frame0001'
    );

    // load the background collision map
    this.wallCollisionService.loadWorldCollisions(
      this,
      this.scaleOfTheGame,
      this.player,
      'KoholintCollisionBackgroundData'
    );

    // Initialize keyboard inputs
    if (this.input.keyboard) {
      this.movementService.initializeKeyboardInput(this.input);
    }
  }

  override update() {
    this.movementService.movePlayer(this.player, this.scaleOfTheGame);
  }
}
