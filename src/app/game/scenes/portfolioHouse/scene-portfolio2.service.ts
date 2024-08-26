import { Injectable } from '@angular/core';
import { MovementService } from '../../core/movement.service';
import { CollisionService } from '../../core/collision.service';
import { PlayerService } from '../../core/player.service';
import { ScaleOfTheGameService } from '../../core/scale-of-the-game.service';
import { HousesDataService } from '../../core/houses-data.service';
import {
  MoreElements,
  portfolio2Data,
} from '../../../models/portfolioData.enum';
import { PortfolioContentService } from './portfolio-content.service';

@Injectable({
  providedIn: 'root',
})
export class ScenePortfolio2Service extends Phaser.Scene {
  private background!: Phaser.GameObjects.Image;
  private player!: Phaser.Physics.Arcade.Sprite;
  private scaleOfTheGame: number = ScaleOfTheGameService.getScaleOfTheGame();
  private moreElement: MoreElements[] | undefined;

  constructor(
    private movementService: MovementService,
    private collisionService: CollisionService,
    private playerService: PlayerService,
    private housesDataService: HousesDataService,
    private portfolioContentService: PortfolioContentService
  ) {
    super({ key: 'scenePortfolio2' });
  }

  preload() {
    this.load.image(
      'portfolioBackground',
      'assets/game/port_folio_house_background2.png'
    );
    this.load.atlas(
      'linkDefault',
      'assets/game/Links_Default.png',
      'assets/game/Links_Default.json'
    );
    //load the collision between the background and the player
    this.load.json(
      'portFolioCollisionBackgroundData',
      'assets/game/port_folio_house_background2.json'
    );

    //load an invisible sprite for the hitbox detection for the change of scene
    this.load.image('sceneTransitionSprite', 'assets/game/hitbox.png');
  }

  create(data: portfolio2Data) {
    this.background = this.add.image(0, 0, 'portfolioBackground');
    this.background.setOrigin(0, 0); // Origin top left
    this.background.setScale(this.scaleOfTheGame);

    const initialPlayerX = 88 * this.scaleOfTheGame;
    const initialPlayerY = 104 * this.scaleOfTheGame;
    const firstAnimationFrame = 'walkingDown/frame0001';

    this.player = this.playerService.createPlayer(
      this.player,
      this,
      this.scaleOfTheGame,
      initialPlayerX,
      initialPlayerY,
      firstAnimationFrame
    );

    this.collisionService.createWorldCollisions(
      this,
      this.scaleOfTheGame,
      this.player,
      'portFolioCollisionBackgroundData'
    );

    this.movementService.initializeInput(this);

    this.collisionService.createSceneTransitionCollision(
      this,
      this.scaleOfTheGame,
      this.player,
      'sceneTransitionSprite',
      'scenePortfolio1',
      80,
      73,
      data?.portfolio1Information.x || 249 * this.scaleOfTheGame, //return to the door the player use else return yo main door
      data?.portfolio1Information.y || 910 * this.scaleOfTheGame,
      data?.portfolio1Information.firstAnimationFrame
    );

    this.moreElement =
      this.housesDataService.getPortfolioData()?.portfolio[
        data.portfolio2Number
      ].more;

    // Load pictures use in the portfolio content in create() because preload() can't access data: portfolio2Data
    if (this.moreElement) {
      this.portfolioContentService.loadPicturePortfolio2(
        this,
        this.moreElement
      );
      this.load.start(); // Démarre le chargement des images spécifiques
      this.load.once('complete', () => {
        if (this.moreElement) {
          this.portfolioContentService.displayPortfolio2(
            this,
            this.moreElement
          );
        }
      });
    } else {
      console.log('error, portfolioData not load from file');
    }
  }

  override update() {
    this.movementService.movePlayer(this.player, this.scaleOfTheGame);
  }
}
