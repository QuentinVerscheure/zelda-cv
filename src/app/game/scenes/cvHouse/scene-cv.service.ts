import { Injectable } from '@angular/core';
import { MovementService } from '../../core/movement.service';
import { CollisionService } from '../../core/collision.service';
import { CvContentService } from './cvContent.service';
import { PlayerService } from '../../core/player.service';
import { NpcService } from '../../core/npc.service';
import { ValidAchievementService } from '../../core/valid-achievement.service';
import { ScaleOfTheGameService } from '../../core/scale-of-the-game.service';
import { CvData } from '../../../models/cvData.enum';
import { HousesDataService } from '../../core/houses-data.service';

@Injectable({
  providedIn: 'root',
})
export class SceneCVService extends Phaser.Scene {
  private background!: Phaser.GameObjects.Image;
  private player!: Phaser.Physics.Arcade.Sprite;
  private scaleOfTheGame: number = ScaleOfTheGameService.getScaleOfTheGame();
  private cvData: CvData | undefined;

  constructor(
    private movementService: MovementService,
    private collisionService: CollisionService,
    private cvContentService: CvContentService,
    private playerService: PlayerService,
    private npcService: NpcService,
    private validAchievementService: ValidAchievementService,
    private housesDataService: HousesDataService
  ) {
    super({ key: 'sceneCV' });
  }

  preload() {
    this.validAchievementService.ValidAchievement('cvHouse');

    this.load.image('cvBackground', 'assets/game/CV_house_background.png');

    //load the collision between the background and the player
    this.load.json(
      'CVCollisionBackgroundData',
      'assets/game/CV_collision_background.json'
    );

    //load an invisible sprite for the hitbox detection for the changement of scene
    this.load.image('sceneTransitionSprite', 'assets/game/hitbox.png');

    this.load.atlas(
      'library_woman',
      'assets/game/library_woman.png',
      'assets/game/library_woman.json'
    );

    this.load.atlas(
      'linkDefault',
      'assets/game/Links_Default.png',
      'assets/game/Links_Default.json'
    );

    // Load pictures use for the CV content
    this.cvData = this.housesDataService.getCvData();
    if (this.cvData) {
      this.cvContentService.loadPicture(this, this.cvData);
    } else {
      console.log('error, cvData not load from file');
    }
  }

  create() {
    this.background = this.add.image(0, 0, 'cvBackground');
    this.background.setOrigin(0, 0); // Origin top left
    this.background.setScale(this.scaleOfTheGame);

    const initialPlayerX = 473 * this.scaleOfTheGame; // Set your desired initial X position
    const initialPlayerY = 420 * this.scaleOfTheGame; // Set your desired initial Y position

    this.player = this.playerService.createPlayer(
      this.player,
      this,
      this.scaleOfTheGame,
      initialPlayerX,
      initialPlayerY,
      'walkingTop/frame0001'
    );

    this.collisionService.createWorldCollisions(
      this,
      this.scaleOfTheGame,
      this.player,
      'CVCollisionBackgroundData'
    );

    this.movementService.initializeInput(this);

    this.collisionService.createSceneTransitionCollision(
      this,
      this.scaleOfTheGame,
      this.player,
      'sceneTransitionSprite',
      'sceneWorld',
      464,
      448,
      553,
      1253
    );

    this.npcService.createNpc(
      this,
      this.scaleOfTheGame,
      680,
      380,
      'library_woman',
      this.player,
      true,
      0.25,
      'library_woman_text'
    );

    const downloadCVButton = this.add.rectangle(
      472 * this.scaleOfTheGame,
      24 * this.scaleOfTheGame,
      16 * this.scaleOfTheGame,
      16 * this.scaleOfTheGame,
      0x0000ff,
      0 //set 0.5 to seen the hitbox
    );

    //icon to dowload the CV
    downloadCVButton.setInteractive({ useHandCursor: true });
    downloadCVButton.on('pointerdown', () => {
      this.validAchievementService.ValidAchievement('cvHouseDownload');
      const a = document.createElement('a');
      a.href = 'assets/docs/CV.pdf';
      a.download = 'Verscheure-Quentin-CV';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });

    if (this.cvData) {
      this.cvContentService.displayTexts(
        this,
        this.scaleOfTheGame,
        this.cvData
      );
    } else {
      console.log('error, cvData not load from file');
    }
  }

  override update() {
    this.movementService.movePlayer(this.player, this.scaleOfTheGame);
  }
}
