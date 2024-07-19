import { Component, OnInit } from '@angular/core';
import * as Phaser from 'phaser';
import { MovementService } from './movement.service'; // Assurez-vous que le chemin est correct

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [],
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.scss'],
})
export class CoreComponent extends Phaser.Scene implements OnInit {
  private phaserGame!: Phaser.Game;
  private config: Phaser.Types.Core.GameConfig;
  private background!: Phaser.GameObjects.Image;
  private player!: Phaser.GameObjects.Sprite;

  constructor(private movementService: MovementService) {
    super({ key: 'main' });
    this.config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: this,
      physics: {
        default: 'arcade',
        arcade: {},
      },
    };
  }

  ngOnInit(): void {
    this.phaserGame = new Phaser.Game(this.config);
  }

  preload() {
    this.load.image('world_background', 'assets/game/Koholint.png');
    // this.load.spritesheet('tiles', 'https://labs.phaser.io/assets/tilemaps/tiles/fantasy-tiles.png', { frameWidth: 64, frameHeight: 64 });
    this.load.atlas(
      'linkDefault',
      'assets/game/Links_Default.png',
      'assets/game/Links_Default.json'
    );
  }

  create() {
    this.background = this.add.image(400, 300, 'world_background');
    this.background.setScale(2);

    const initialPlayerX = -1345; // Set your desired initial X position
    const initialPlayerY = 1000; // Set your desired initial Y position

    this.player = this.physics.add.sprite(initialPlayerX, initialPlayerY, 'linkDefault', 'walkingRight/frame0001');
    this.player.setScale(2);

    this.cameras.main.startFollow(this.player);

    // Initialize players animation
    this.movementService.initializeMoveAnimation(this.anims);

    // Initialize keyboard inputs
    if (this.input.keyboard) {
      this.movementService.initializeKeyboardInput(this.input);
    }
  }

  override update() {
    this.movementService.movePlayer(this.cameras.main, this.player);
  }
}
