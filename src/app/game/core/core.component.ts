import { Component, OnInit } from '@angular/core';
import * as Phaser from 'phaser';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [],
  templateUrl: './core.component.html',
  styleUrl: './core.component.scss'
})
export class CoreComponent extends Phaser.Scene implements OnInit {
  private phaserGame!: Phaser.Game;
  private config: Phaser.Types.Core.GameConfig;

  constructor() {
    super();
    this.config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: this,
      physics: {
        default: 'arcade',
        arcade: {}

      }
    }
  }

  ngOnInit(): void {
    this.phaserGame = new Phaser.Game(this.config);
  }

  preload() {
    this.load.setBaseURL('http://localhost:4200/');

    this.load.image('linkDefault', 'assets/game/Koholint_Island_Overworld.png');
    this.load.image('world_background', 'assets/game/Links_Awakening.png');
  }

  create() {
    this.physics.add.image(400, 300, 'linkDefault');
    this.add.image(400, 300, 'world_background');

    this.anims.create({
      key: 'guard',
      frames: this.anims.generateFrameNames('knight', { prefix: 'guard/frame', start: 0, end: 5, zeroPad: 4 }),
      frameRate: 8,
      repeat: 2
  });
  }

  // update() {
  //   // Logique du jeu ici
  // }
}