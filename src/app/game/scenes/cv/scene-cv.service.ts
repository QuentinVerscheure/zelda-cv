import { Injectable } from '@angular/core';
import { MovementService } from '../../core/movement.service';
import { WallCollisionService } from '../../core/wall-collision.service';
import { CvContent } from '../../../models/Cv_content.enum';
import { CvContentService } from './cvContent.service';
import { PlayerService } from '../../core/player.service';

@Injectable({
  providedIn: 'root',
})
export class SceneCVService extends Phaser.Scene {
  private background!: Phaser.GameObjects.Image;
  private player!: Phaser.Physics.Arcade.Sprite;
  private scaleOfTheGame: number = 4;

  constructor(
    private movementService: MovementService,
    private wallCollisionService: WallCollisionService,
    private cvContentService: CvContentService,
    private playerService: PlayerService
  ) {
    super({ key: 'sceneCV' });
  }

  preload() {
    this.load.image('cv_background', 'assets/game/CV_house_background.png');
    this.load.atlas(
      'linkDefault',
      'assets/game/Links_Default.png',
      'assets/game/Links_Default.json'
    );
    //load the collision between the background and the player
    this.load.json(
      'CVCollisionBackgroundData',
      'assets/game/CV_collision_background.json'
    );

    this.load.image('virageLogo', 'assets/logo/Logo_Virage.png');
    this.load.image('eniLogo', 'assets/logo/ecoleeni-logo.jpg');
    this.load.image('allplanLogo', 'assets/logo/logo-allplan.png');
    this.load.image('afpaLogo', 'assets/logo/Logo-AFPA.png');

    //load an invisible sprite for the hitbox detection for the change of scene
    this.load.image('invisibleSprite', 'assets/game/hitbox.png');
  }

  create() {
    this.background = this.add.image(0, 0, 'cv_background');
    this.background.setOrigin(0, 0); // Origin top left
    this.background.setScale(this.scaleOfTheGame);

    const initialPlayerX = 473 * this.scaleOfTheGame; // Set your desired initial X position
    const initialPlayerY = 420 * this.scaleOfTheGame; // Set your desired initial Y position

    this.player = this.playerService.createPlayer(
      this.player,
      this,
      this.scaleOfTheGame,
      initialPlayerX,
      initialPlayerY,
      'walkingTop/frame0001'
    );

    // load the background collision map
    this.wallCollisionService.loadWorldCollisions(
      this,
      this.scaleOfTheGame,
      this.player,
      'CVCollisionBackgroundData'
    );

    // Initialize keyboard inputs
    if (this.input.keyboard) {
      this.movementService.initializeKeyboardInput(this.input);
    }

    // Load and display the content of the CV frames
    this.cvContentService.loadTexts(this, this.scaleOfTheGame);

    // Create hitbox for scene transition using an invisible sprite
    const exitHitbox = this.physics.add.sprite(
      464 * this.scaleOfTheGame,
      448 * this.scaleOfTheGame,
      'invisibleSprite'
    );
    exitHitbox.setOrigin(0, 0); // Position by the top-left corner
    exitHitbox.displayWidth = 16 * this.scaleOfTheGame; // Set width
    exitHitbox.displayHeight = 16 * this.scaleOfTheGame; // Set height
    exitHitbox.setVisible(false); // Make the sprite invisible
    exitHitbox.body.immovable = true; // Make the hitbox immovable
    exitHitbox.body.allowGravity = false; // Disable gravity for the hitbox

    this.physics.add.collider(
      this.player,
      exitHitbox,
      (player, hitbox) =>
        this.onExitHitboxCollision(
          player as Phaser.Physics.Arcade.Sprite,
          hitbox as Phaser.Physics.Arcade.Sprite
        ),
      undefined,
      this
    );
  }

  override update() {
    this.movementService.movePlayer(this.player, this.scaleOfTheGame);
  }

  onExitHitboxCollision(
    player: Phaser.Physics.Arcade.Sprite,
    hitbox: Phaser.Physics.Arcade.Sprite
  ) {
    this.scene.start('sceneWorld');
  }
}
