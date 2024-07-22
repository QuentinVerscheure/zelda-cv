import { Injectable } from '@angular/core';
import { MovementService } from '../../core/movement.service';
import { WallCollisionService } from '../../core/wall-collision.service';
import { CvContent } from '../../../models/Cv_content.enum';
import { CvContentService } from './cvContent.service';

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
    private cvContentService: CvContentService
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
  }

  create() {
    this.background = this.add.image(0, 0, 'cv_background');
    this.background.setOrigin(0, 0); // Origin top left
    this.background.setScale(this.scaleOfTheGame);

    const initialPlayerX = 473 * this.scaleOfTheGame; // Set your desired initial X position
    const initialPlayerY = 420 * this.scaleOfTheGame; // Set your desired initial Y position

    this.player = this.physics.add.sprite(
      initialPlayerX,
      initialPlayerY,
      'linkDefault',
      'walkingTop/frame0001'
    );
    this.player.setScale(this.scaleOfTheGame);
    this.player.setSize(10, 10); // Dimensions of hitbox
    this.player.setOffset(5, 9); //offset of the hitbox

    this.cameras.main.startFollow(this.player);

    // Initialize players animation
    this.movementService.initializeMoveAnimation(this.anims);

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
  }

  override update() {
    this.movementService.movePlayer(this.player, this.scaleOfTheGame);
  }



}
