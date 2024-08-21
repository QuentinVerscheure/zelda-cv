import { Injectable } from '@angular/core';
import { MovementService } from '../../core/movement.service';
import { CollisionService } from '../../core/collision.service';
import { PlayerService } from '../../core/player.service';
import { ScaleOfTheGameService } from '../../core/scale-of-the-game.service';

@Injectable({
  providedIn: 'root',
})
export class ScenePortfolio2Service extends Phaser.Scene {
  private background!: Phaser.GameObjects.Image;
  private player!: Phaser.Physics.Arcade.Sprite;
  private scaleOfTheGame: number = ScaleOfTheGameService.getScaleOfTheGame();

  constructor(
    private movementService: MovementService,
    private collisionService: CollisionService,
    private playerService: PlayerService
  ) {
    super({ key: 'scenePortfolio2' });
  }

  preload() {
    this.load.image(
      'portfolioBackground',
      'assets/game/port_folio_house_background2.png'
    );
    this.load.atlas(
      'linkDefault',
      'assets/game/Links_Default.png',
      'assets/game/Links_Default.json'
    );
    //load the collision between the background and the player
    this.load.json(
      'portFolioCollisionBackgroundData',
      'assets/game/port_folio_house_background2.json'
    );

    //load an invisible sprite for the hitbox detection for the change of scene
    this.load.image('sceneTransitionSprite', 'assets/game/hitbox.png');
  }

  create(data: { x: number; y: number; firstAnimationFrame: string }) {
    this.background = this.add.image(0, 0, 'portfolioBackground');
    this.background.setOrigin(0, 0); // Origin top left
    this.background.setScale(this.scaleOfTheGame);

    const initialPlayerX = 88 * this.scaleOfTheGame;
    const initialPlayerY = 104 * this.scaleOfTheGame;
    const firstAnimationFrame = 'walkingDown/frame0001';

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
      'portFolioCollisionBackgroundData'
    );

    MovementService.initializeInput(this);

    this.collisionService.createSceneTransitionCollision(
      this,
      this.scaleOfTheGame,
      this.player,
      'sceneTransitionSprite',
      'scenePortfolio1',
      80,
      73,
      data?.x || 249 * this.scaleOfTheGame, //return to the door the player use else return yo main door
      data?.y || 910 * this.scaleOfTheGame,
      data?.firstAnimationFrame
    );
  }

  override update() {
    MovementService.movePlayer(this.player, this.scaleOfTheGame);
  }
}
