import { Component, OnInit } from '@angular/core';
import * as Phaser from 'phaser';

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
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private background!: Phaser.GameObjects.Image;
  private player!: Phaser.GameObjects.Image;
  private keys!: { Z: Phaser.Input.Keyboard.Key, Q: Phaser.Input.Keyboard.Key, S: Phaser.Input.Keyboard.Key, D: Phaser.Input.Keyboard.Key };

  constructor() {
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
    this.load.setBaseURL('http://localhost:4200/');

    this.load.image('linkDefault', 'assets/game/Links_Default.png');
    this.load.image('world_background', 'assets/game/Koholint.png');
  }

  create() {
    this.background = this.add.image(400, 300, 'world_background');
    this.background.setScale(2);


    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;
    this.player = this.physics.add.image(centerX, centerY, 'linkDefault');
    this.player.setScale(2);
    

    // Initialize keyboard controls if this.input.keyboard is available
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.keys = this.input.keyboard.addKeys('Z,Q,S,D') as {
        Z: Phaser.Input.Keyboard.Key;
        Q: Phaser.Input.Keyboard.Key;
        S: Phaser.Input.Keyboard.Key;
        D: Phaser.Input.Keyboard.Key;
      };
    }
  }

  override update() {
    // Speed of background movement when player moove
    const speed = 1.4;

    if (this.cursors.left.isDown || this.keys.Q.isDown) {
      this.background.x += speed;
    } else if (this.cursors.right.isDown || this.keys.D.isDown) {
      this.background.x -= speed;
    }

    if (this.cursors.up.isDown || this.keys.Z.isDown) {
      this.background.y += speed;
    } else if (this.cursors.down.isDown || this.keys.S.isDown) {
      this.background.y -= speed;
    }
  }
}