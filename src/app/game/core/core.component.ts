import { Component, OnInit } from '@angular/core';
import * as Phaser from 'phaser';
import { SceneCVService } from '../scenes/cvHouse/scene-cv.service';
import { SceneWorldService } from '../scenes/world/scene-world.service';
import { SceneContactService } from '../scenes/contactHouse/scene-contact.service';
import { SceneGuestBookService1 } from '../scenes/guestBookHouse/scene-guest-book1.service';
import { SceneGuestBookService2 } from '../scenes/guestBookHouse/scene-guest-book2.service';
import { SceneLinkService } from '../scenes/linkHouse/scene-link.service';
import { ScenePlayerService } from '../scenes/playerHouse/scene-player.service';

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
    private sceneLink: SceneLinkService
  ) {
    this.config = {
      type: Phaser.AUTO,
      width: 1600,
      height: 1000,
      scene: [
        this.sceneLink,
        this.sceneWorld, //1st scene will be load at the start of the game
        this.sceneContact,
        this.sceneCV,
        this.sceneGuestBook1,
        this.sceneGuestBook2,
        this.scenePlayerHouse,
        // this.sceneLink
      ],
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
