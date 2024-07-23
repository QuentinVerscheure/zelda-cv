import { Injectable } from '@angular/core';
import { MovementService } from '../../core/movement.service';
import { CollisionService } from '../../core/collision.service';
import { PlayerService } from '../../core/player.service';
import { SceneTransitionCollisionData } from '../../../models/SceneTransitionCollisionData.enum';

@Injectable({
  providedIn: 'root',
})
export class SceneWorldService extends Phaser.Scene {
  private background!: Phaser.GameObjects.Image;
  private player!: Phaser.Physics.Arcade.Sprite;
  private scaleOfTheGame: number = 2;

  constructor(
    private movementService: MovementService,
    private collisionService: CollisionService,
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
    this.load.image('creditHouse', 'assets/game/hitbox.png');
    this.load.image('cvHouse', 'assets/game/hitbox.png');
    this.load.image('playerHouse', 'assets/game/hitbox.png');
    this.load.image('linkHouse', 'assets/game/hitbox.png');
    this.load.image('variousHouse', 'assets/game/hitbox.png');
    this.load.image('portfolioHouse', 'assets/game/hitbox.png');
    this.load.image('contactHouse', 'assets/game/hitbox.png');
    this.load.image('guestBookHouse', 'assets/game/hitbox.png');
  }

  create(data: { x: number; y: number }) {
    this.background = this.add.image(0, 0, 'worldBackground');
    this.background.setOrigin(0, 0); // Origin top left
    this.background.setScale(this.scaleOfTheGame);

    //coordonate depanding of the scene transition
    const initialPlayerX =
      data?.x * this.scaleOfTheGame || 408 * this.scaleOfTheGame;
    const initialPlayerY =
      data?.y * this.scaleOfTheGame || 1378 * this.scaleOfTheGame;

    this.player = this.playerService.createPlayer(
      this.player,
      this,
      this.scaleOfTheGame,
      initialPlayerX,
      initialPlayerY,
      'walkingRight/frame0001'
    );

    // load the background collision map
    this.collisionService.createWorldCollisions(
      this,
      this.scaleOfTheGame,
      this.player,
      'KoholintCollisionBackgroundData'
    );

    // Initialize keyboard inputs
    if (this.input.keyboard) {
      this.movementService.initializeKeyboardInput(this.input);
    }

    // create scene transition collision
    let sceneTransitionCollisionData: SceneTransitionCollisionData[] = [
      ['creditHouse', 'sceneCredit', 400, 1082],
      ['creditHouse', 'sceneCredit', 432, 1082],
      ['cvHouse', 'sceneCV', 543, 1226],
      ['playerHouse', 'scenePlayerHouse', 399, 1338],
      ['linkHouse', 'sceneLien', 240, 1322],
      ['variousHouse', 'sceneDivers', 208, 1322],
      ['portfolioHouse', 'scenePortfolio', 560, 1466],
      ['contactHouse', 'sceneContact', 400, 1466],
      ['guestBookHouse', 'sceneGuestBook', 224, 1482],
    ];

    for (const data of sceneTransitionCollisionData) {
      this.collisionService.createSceneTransitionCollision(
        this,
        this.scaleOfTheGame,
        this.player,
        data[0],
        data[1],
        data[2],
        data[3]
      );
    }
  }

  override update() {
    this.movementService.movePlayer(this.player, this.scaleOfTheGame);
  }
}
