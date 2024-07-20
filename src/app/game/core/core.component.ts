import { Component, OnInit } from '@angular/core';
import * as Phaser from 'phaser';
import { MovementService } from './movement.service';
import { WallCollisionService } from './wall-collision.service';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [],
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.scss'],
})
export class CoreComponent extends Phaser.Scene implements OnInit {

  private scaleOfTheGame: number = 2;

  private phaserGame!: Phaser.Game;
  private config: Phaser.Types.Core.GameConfig;
  private background!: Phaser.GameObjects.Image;
  private player!: Phaser.Physics.Arcade.Sprite;

  constructor(private movementService: MovementService, private wallCollisionService: WallCollisionService) {
    super({ key: 'main' });
    this.config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: this,
      physics: {
        default: 'arcade',
        arcade: {
          debug: true,
        },
      },
    };
  }

  ngOnInit(): void {
    this.phaserGame = new Phaser.Game(this.config);
  }

  preload() {
    this.load.image('world_background', 'assets/game/Koholint.png');
    this.load.atlas(
      'linkDefault',
      'assets/game/Links_Default.png',
      'assets/game/Links_Default.json'
    );
    //load the collision between the background and the player
    this.load.json('KoholintCollisionBackgroundData', 'assets/game/Koholint_collision_background.json'); //background collision map file
  }

  create() {
    this.background = this.add.image(0, 0, 'world_background');
    this.background.setOrigin(0, 0); // Origin top left
    this.background.setScale(this.scaleOfTheGame);

    const initialPlayerX = 408*this.scaleOfTheGame; // Set your desired initial X position
    const initialPlayerY = 1378*this.scaleOfTheGame; // Set your desired initial Y position

    this.player = this.physics.add.sprite(
      initialPlayerX,
      initialPlayerY,
      'linkDefault',
      'walkingRight/frame0001'
    );
    this.player.setScale(this.scaleOfTheGame);
    this.player.setSize(10, 10); // Dimensions of hitbox
    this.player.setOffset(5, 9); //offset of the hitbox

    this.cameras.main.startFollow(this.player);

    // Initialize players animation
    this.movementService.initializeMoveAnimation(this.anims);

    // load the background collision map
    this.wallCollisionService.loadCollisions(this, this.scaleOfTheGame, this.player);

    // Initialize keyboard inputs
    if (this.input.keyboard) {
      this.movementService.initializeKeyboardInput(this.input);
    }
  }



  override update() {
    this.movementService.movePlayer(this.player, this.scaleOfTheGame);
  }
}
