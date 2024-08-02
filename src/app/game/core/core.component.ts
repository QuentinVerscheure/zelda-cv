import { Component, OnInit } from '@angular/core';
import * as Phaser from 'phaser';
import VirtualJoystickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin.js';
import { SceneCVService } from '../scenes/cvHouse/scene-cv.service';
import { SceneWorldService } from '../scenes/world/scene-world.service';
import { SceneContactService } from '../scenes/contactHouse/scene-contact.service';
import { SceneGuestBookService1 } from '../scenes/guestBookHouse/scene-guest-book1.service';
import { SceneGuestBookService2 } from '../scenes/guestBookHouse/scene-guest-book2.service';
import { SceneLinkService } from '../scenes/linkHouse/scene-link.service';
import { ScenePlayerService } from '../scenes/playerHouse/scene-player.service';
import { SceneVariousService } from '../scenes/variousHouse/scene-various.service';
import { SceneCreditService } from '../scenes/creditHouse/scene-credit.service';

@Component({
  selector: 'app-game',
  standalone: true,
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.scss'],
  providers: [],
})
export class CoreComponent implements OnInit {
  private phaserGame!: Phaser.Game;
  private config: Phaser.Types.Core.GameConfig;

  constructor(
    private sceneWorld: SceneWorldService,
    private sceneContact: SceneContactService,
    private sceneCV: SceneCVService,
    private sceneGuestBook1: SceneGuestBookService1,
    private sceneGuestBook2: SceneGuestBookService2,
    private scenePlayerHouse: ScenePlayerService,
    private sceneLink: SceneLinkService,
    private sceneVarious: SceneVariousService,
    private sceneCreditService: SceneCreditService
  ) {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.config = {
      type: Phaser.AUTO,
      width: width,
      height: height,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      scene: [
        this.scenePlayerHouse, //1st scene will be load at the start of the game
        this.sceneWorld,
        this.sceneContact,
        this.sceneCV,
        this.sceneGuestBook1,
        this.sceneGuestBook2,
        this.sceneLink,
        this.sceneVarious,
        this.sceneCreditService,
      ],
      plugins: {
        global: [
          {
            key: 'rexVirtualJoystick',
            plugin: VirtualJoystickPlugin,
            start: true
          }
        ]
      },
      pixelArt: true, // Enable pixel art mode
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
