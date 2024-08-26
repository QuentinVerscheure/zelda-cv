import { Injectable } from '@angular/core';
import { MovementService } from '../../core/movement.service';
import { CollisionService } from '../../core/collision.service';
import { PlayerService } from '../../core/player.service';
import { NpcService } from '../../core/npc.service';
import { ValidAchievementService } from '../../core/valid-achievement.service';
import { ScaleOfTheGameService } from '../../core/scale-of-the-game.service';
import { LinkData } from '../../../models/linkData.enum';
import { HousesDataService } from '../../core/houses-data.service';
import { LinkContentService } from './link-content.service';

@Injectable({
  providedIn: 'root',
})
export class SceneLinkService extends Phaser.Scene {
  private background!: Phaser.GameObjects.Image;
  private player!: Phaser.Physics.Arcade.Sprite;
  private scaleOfTheGame: number = ScaleOfTheGameService.getScaleOfTheGame();
  private linkData: LinkData | undefined;

  constructor(
    private collisionService: CollisionService,
    private playerService: PlayerService,
    private npcService: NpcService,
    private validAchievementService: ValidAchievementService,
    private housesDataService: HousesDataService,
    private linkContentService: LinkContentService, 
    private movementService: MovementService,
  ) {
    super({ key: 'sceneLink' });
  }

  preload() {
    this.validAchievementService.ValidAchievement('linkHouse');

    this.load.image('link_background', 'assets/game/Link_House_Background.png');

    //player
    this.load.atlas(
      'linkDefault',
      'assets/game/Links_Default.png',
      'assets/game/Links_Default.json'
    );

    //npc
    this.load.atlas(
      'LinkHouseNpc',
      'assets/game/Link_House_npc.png',
      'assets/game/Link_House_npc.json'
    );

    //load the collision between the background and the player
    this.load.json(
      'linkCollisionBackgroundData',
      'assets/game/Link_House_collision_Background.json'
    );

    //load an invisible sprite for the hitbox detection for the change of scene
    this.load.image('sceneTransitionSprite', 'assets/game/hitbox.png');

    // Load pictures use for the CV content
    this.linkData = this.housesDataService.getLinkData();
    if (this.linkData) {
      this.linkContentService.loadPicture(this, this.linkData);
    } else {
      console.log('error, cvData not load from file');
    }
  }

  create() {
    this.background = this.add.image(0, 0, 'link_background');
    this.background.setOrigin(0, 0); // Origin top left
    this.background.setScale(this.scaleOfTheGame);

    const initialPlayerX = 48 * this.scaleOfTheGame; // Set your desired initial X position
    const initialPlayerY = 105 * this.scaleOfTheGame; // Set your desired initial Y position

    this.player = this.playerService.createPlayer(
      this.player,
      this,
      this.scaleOfTheGame,
      initialPlayerX,
      initialPlayerY,
      'walkingTop/frame0001'
    );

    this.npcService.createNpc(
      this,
      this.scaleOfTheGame,
      25,
      68,
      'LinkHouseNpc',
      this.player,
      true,
      0.5
    );

    this.collisionService.createWorldCollisions(
      this,
      this.scaleOfTheGame,
      this.player,
      'linkCollisionBackgroundData'
    );

    this.movementService.initializeInput(this);

    this.collisionService.createSceneTransitionCollision(
      this,
      this.scaleOfTheGame,
      this.player,
      'sceneTransitionSprite',
      'sceneWorld',
      40,
      120,
      249,
      1345
    );

    if (this.linkData) {
      this.linkContentService.displayContent(
        this,
        this.linkData,
        this.scaleOfTheGame
      );
    }
  }

  override update() {
    this.movementService.movePlayer(this.player, this.scaleOfTheGame);
  }
}
