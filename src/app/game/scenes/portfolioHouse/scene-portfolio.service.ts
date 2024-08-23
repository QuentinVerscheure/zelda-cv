import { Injectable } from '@angular/core';
import { MovementService } from '../../core/movement.service';
import { CollisionService } from '../../core/collision.service';
import { PlayerService } from '../../core/player.service';
import { ValidAchievementService } from '../../core/valid-achievement.service';
import { ScaleOfTheGameService } from '../../core/scale-of-the-game.service';
import { PortfolioContentService } from './portfolio-content.service';
import {
  portfolio2Data,
  PortfolioDatas,
} from '../../../models/portfolioData.enum';
import { HousesDataService } from '../../core/houses-data.service';

@Injectable({
  providedIn: 'root',
})
export class ScenePortfolioService extends Phaser.Scene {
  private background!: Phaser.GameObjects.Image;
  private player!: Phaser.Physics.Arcade.Sprite;
  private scaleOfTheGame: number = ScaleOfTheGameService.getScaleOfTheGame();
  private portfolioData: PortfolioDatas | undefined;

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
      this.portfolioContentService.loadPicturePortfolio1(
        this,
        this.portfolioData
      );
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
    //create  transition to scene world
    this.collisionService.createSceneTransitionCollision(
      this,
      this.scaleOfTheGame,
      this.player,
      'sceneTransitionSprite',
      'sceneWorld',
      240,
      935,
      568,
      1491
    );

    //create all transition from portfolio1 to portfolio2
    transitions.forEach((transition, index) => {
      // Create hitbox for scene transition using an invisible sprite
      const exitHitbox = this.physics.add.sprite(
        transition.x1 * this.scaleOfTheGame,
        transition.y1 * this.scaleOfTheGame,
        transition.sprite
      );
    
      exitHitbox.setOrigin(0, 0); // Position by the top-left corner
      exitHitbox.displayWidth = 16 * this.scaleOfTheGame; // Set width
      exitHitbox.displayHeight = 16 * this.scaleOfTheGame; // Set height
      exitHitbox.setVisible(false); // Make the sprite invisible
      exitHitbox.body.immovable = true; // Make the hitbox immovable
      exitHitbox.body.allowGravity = false; // Disable gravity for the hitbox
    
      // Define the data to pass to the next scene
      const portfolio2Data: portfolio2Data = {
        portfolio1Information: {
          x: transition.x2,
          y: transition.y2,
          firstAnimationFrame: firstAnimationFrame, // Assurez-vous que cette variable est définie correctement
        },
        portfolio2Number: index, // Utilisez l'index pour identifier quel portfolio afficher
      };
    
      // Add collider with callback for scene transition
      this.physics.add.collider(
        this.player,
        exitHitbox,
        () => {
          this.scene.start('scenePortfolio2', portfolio2Data); // Transition to the scene with data
        },
        undefined,
        this
      );
    });
    

    if (this.portfolioData) {
      this.portfolioContentService.displayPortfolio(this, this.portfolioData);
      this.portfolioContentService.createKeyBlock(
        this,
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
