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
import { ScenePortfolioService } from '../scenes/portfolioHouse/scene-portfolio.service';
import { ScenePortfolio2Service } from '../scenes/portfolioHouse/scene-portfolio2.service';
import { HousesDataService } from './houses-data.service';
import { ConfigService } from '../../services/config.service';
import { AppConfig } from '../../models/config.enum';

@Component({
  selector: 'app-game',
  standalone: true,
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.scss'],
  providers: [],
})
export class CoreComponent implements OnInit {
  private phaserGame!: Phaser.Game;

  constructor(
    private sceneWorld: SceneWorldService,
    private sceneContact: SceneContactService,
    private sceneCV: SceneCVService,
    private sceneGuestBook1: SceneGuestBookService1,
    private sceneGuestBook2: SceneGuestBookService2,
    private scenePlayerHouse: ScenePlayerService,
    private sceneLink: SceneLinkService,
    private sceneVarious: SceneVariousService,
    private sceneCreditService: SceneCreditService,
    private scenePortfolioService: ScenePortfolioService,
    private scenePortfolio2Service: ScenePortfolio2Service,
    private housesDataService: HousesDataService,
    private configService: ConfigService
  ) {}

  ngOnInit(): void {
    this.configService.config$.subscribe((config) => {
      //subscribe to the config.json file to know if debug mode=true

      const width = window.innerWidth;
      const height = window.innerHeight;

      let Gameconfig: Phaser.Types.Core.GameConfig = {
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
          this.scenePortfolioService,
          this.scenePortfolio2Service,
        ],
        plugins: {
          global: [
            {
              key: 'rexVirtualJoystick',
              plugin: VirtualJoystickPlugin,
              start: true,
            },
          ],
        },
        pixelArt: true, // (if not, blur pixel)
        physics: {
          default: 'arcade',
          arcade: {
            debug: config?.debugMode,
          },
        },
      };

      //preload config file for avoiding bug with asynchonus data with the preload() and create() working way of phaser.
      this.housesDataService.loadHousesData();

      this.phaserGame = new Phaser.Game(Gameconfig);
    });
  }
}
