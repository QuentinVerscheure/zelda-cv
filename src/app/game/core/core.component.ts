import { Component, OnInit } from '@angular/core';
import * as Phaser from 'phaser';
import { SceneCVService } from '../scenes/cvHouse/scene-cv.service';
import { SceneWorldService } from '../scenes/world/scene-world.service';

@Component({
  selector: 'app-game',
  standalone: true,
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.scss'],
  providers: [SceneCVService],
  
})
export class CoreComponent implements OnInit {
  private phaserGame!: Phaser.Game;
  private config: Phaser.Types.Core.GameConfig;

  constructor(
    private sceneWorld: SceneWorldService,
    private sceneCV: SceneCVService
  ) {
    this.config = {
      type: Phaser.AUTO,
      width: 1600,
      height: 1000,
      scene: [this.sceneWorld, this.sceneCV],
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
}
