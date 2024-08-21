import { Injectable } from '@angular/core';
import { MovementService } from '../../core/movement.service';
import { CollisionService } from '../../core/collision.service';
import { PlayerService } from '../../core/player.service';
import { ValidAchievementService } from '../../core/valid-achievement.service';
import { ScaleOfTheGameService } from '../../core/scale-of-the-game.service';
import { PortfolioContentService } from './portfolio-content.service';
import { PortfolioData } from '../../../models/portfolioData.enum';
import { HousesDataService } from '../../core/houses-data.service';

@Injectable({
  providedIn: 'root',
})
export class ScenePortfolioService extends Phaser.Scene {
  private background!: Phaser.GameObjects.Image;
  private player!: Phaser.Physics.Arcade.Sprite;
  private scaleOfTheGame: number = ScaleOfTheGameService.getScaleOfTheGame();
  private portfolioData: PortfolioData | undefined;

  constructor(
    private movementService: MovementService,
    private collisionService: CollisionService,
    private playerService: PlayerService,
    private validAchievementService: ValidAchievementService,
    private portfolioContentService: PortfolioContentService,
    private housesDataService: HousesDataService
  ) {
    super({ key: 'scenePortfolio1' });
  }

  preload() {
    this.validAchievementService.ValidAchievement('portfolioHouse');

    this.load.image(
      'portFolioHouseBackground',
      'assets/game/port_folio_house_background.png'
    );
    this.load.atlas(
      'linkDefault',
      'assets/game/Links_Default.png',
      'assets/game/Links_Default.json'
    );
    //load the collision between the background and the player
    this.load.json(
      'portFolioHouseBackgroundData',
      'assets/game/port_folio_house_background.json'
    );

    //load an invisible sprite for the hitbox detection for the change of scene
    for (let i = 1; i <= 7; i++) {
      this.load.image(
        `sceneTransitionSprite${i + 1}`,
        'assets/game/hitbox.png'
      );
    }

    this.load.image('keyBlock', 'assets/game/key_block.png');

    // Load pictures use in the portfolio content
    this.portfolioData = this.housesDataService.getPortfolioData();
    if (this.portfolioData) {
      this.portfolioContentService.loadPicture(this, this.portfolioData);
    } else {
      console.log('error, portfolioData not load from file');
    }
  }

  create(data: { x: number; y: number; firstAnimationFrame: string }) {
    this.background = this.add.image(0, 0, 'portFolioHouseBackground');
    this.background.setOrigin(0, 0); // Origin top left
    this.background.setScale(this.scaleOfTheGame);

    //coordonate depanding of the scene transition
    const initialPlayerX =
      data?.x * this.scaleOfTheGame || 249 * this.scaleOfTheGame;
    const initialPlayerY =
      data?.y * this.scaleOfTheGame || 910 * this.scaleOfTheGame;
    const firstAnimationFrame =
      data?.firstAnimationFrame || 'walkingTop/frame0001';

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
      'portFolioHouseBackgroundData'
    );

    MovementService.initializeInput(this);

    //table of all transiton between scenes
    const transitions = [
      {
        sprite: 'sceneTransitionSprite1',
        targetScene: 'sceneWorld',
        x1: 240,
        y1: 935,
        x2: 568,
        y2: 1491,
      },
      {
        sprite: 'sceneTransitionSprite2',
        targetScene: 'scenePortfolio2',
        x1: 16,
        y1: 736,
        x2: 40,
        y2: 740,
        firstAnimationFrame: 'walkingRight/frame0001',
      },
      {
        sprite: 'sceneTransitionSprite3',
        targetScene: 'scenePortfolio2',
        x1: 464,
        y1: 736,
        x2: 456,
        y2: 740,
        firstAnimationFrame: 'walkingLeft/frame0001',
      },
      {
        sprite: 'sceneTransitionSprite4',
        targetScene: 'scenePortfolio2',
        x1: 16,
        y1: 464,
        x2: 40,
        y2: 470,
        firstAnimationFrame: 'walkingRight/frame0001',
      },
      {
        sprite: 'sceneTransitionSprite5',
        targetScene: 'scenePortfolio2',
        x1: 464,
        y1: 464,
        x2: 456,
        y2: 470,
        firstAnimationFrame: 'walkingLeft/frame0001',
      },
      {
        sprite: 'sceneTransitionSprite6',
        targetScene: 'scenePortfolio2',
        x1: 16,
        y1: 192,
        x2: 40,
        y2: 198,
        firstAnimationFrame: 'walkingRight/frame0001',
      },
      {
        sprite: 'sceneTransitionSprite7',
        targetScene: 'scenePortfolio2',
        x1: 464,
        y1: 192,
        x2: 456,
        y2: 198,
        firstAnimationFrame: 'walkingLeft/frame0001',
      },
    ];

    //create all transition between scenes
    transitions.forEach((transition) => {
      this.collisionService.createSceneTransitionCollision(
        this,
        this.scaleOfTheGame,
        this.player,
        transition.sprite,
        transition.targetScene,
        transition.x1,
        transition.y1,
        transition.x2,
        transition.y2,
        transition.firstAnimationFrame
      );
    });

    if (this.portfolioData) {
      this.portfolioContentService.displayPortfolio(
        this,
        this.scaleOfTheGame,
        this.portfolioData
      );
      this.portfolioContentService.createKeyBlock(
        this,
        this.scaleOfTheGame,
        this.player,
        this.portfolioData
      );
    } else {
      console.log('error, portfolioData not load from file');
    }
  }

  override update() {
    MovementService.movePlayer(this.player, this.scaleOfTheGame);
  }
}
