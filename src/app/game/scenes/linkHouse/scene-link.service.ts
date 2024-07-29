import { Injectable } from '@angular/core';
import { MovementService } from '../../core/movement.service';
import { CollisionService } from '../../core/collision.service';
import { PlayerService } from '../../core/player.service';
import { NpcService } from '../../core/npc.service';

@Injectable({
  providedIn: 'root'
})
export class SceneLinkService extends Phaser.Scene {

  private background!: Phaser.GameObjects.Image;
  private player!: Phaser.Physics.Arcade.Sprite;
  private scaleOfTheGame: number = 4;

  constructor(
    private movementService: MovementService,
    private collisionService: CollisionService,
    private playerService: PlayerService,
    private npcService: NpcService
  ) {
    super({ key: 'sceneLink' });
  }

  preload() {
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

    this.load.image('gitHub', 'assets/logo/GitHub-Logo.png');
    this.load.image('linkedin', 'assets/logo/logo-linkedin_50.png');
    this.load.image('codepen', 'assets/logo/codepen_50.png');
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

    if (this.input.keyboard) {
      this.movementService.initializeKeyboardInput(this.input);
    }

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

    this.createPicture(68, 60, 0.07, 'gitHub', 'https://github.com/QuentinVerscheure', this.scaleOfTheGame);
    this.createPicture(45, 60, 0.3, 'linkedin', 'https://www.linkedin.com/in/quentin-verscheure-b7b4b09b/l', this.scaleOfTheGame);
    this.createPicture(55, 45, 0.15, 'codepen', 'https://codepen.io/Verscheure-Quentin', this.scaleOfTheGame);
  }

  override update() {
    this.movementService.movePlayer(this.player, this.scaleOfTheGame);
  }

  createPicture(x: number, y: number, scale: number, picture: string, url:string, scaleOfTheGame:number){
    const pictureSprite = this.add.image(scaleOfTheGame*x, scaleOfTheGame*y, picture);
    pictureSprite.setScale(scale*scaleOfTheGame);

    pictureSprite.setInteractive({ useHandCursor: true });

    pictureSprite.on('pointerdown', () => {
      window.open(url, '_blank');
    });
  }
}
