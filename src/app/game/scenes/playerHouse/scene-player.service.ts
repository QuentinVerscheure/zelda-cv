import { Injectable } from '@angular/core';
import { MovementService } from '../../core/movement.service';
import { CollisionService } from '../../core/collision.service';
import { PlayerService } from '../../core/player.service';
import { NpcService } from '../../core/npc.service';

@Injectable({
  providedIn: 'root',
})
export class ScenePlayerService extends Phaser.Scene {
  private background!: Phaser.GameObjects.Image;
  private player!: Phaser.Physics.Arcade.Sprite;
  private scaleOfTheGame: number = 4;

  constructor(
    private movementService: MovementService,
    private collisionService: CollisionService,
    private playerService: PlayerService,
    private npcService: NpcService
  ) {
    super({ key: 'scenePlayerHouse' });
  }

  preload() {
    this.load.image(
      'Player_background',
      'assets/game/Player_House_background.png'
    );
    this.load.atlas(
      'linkDefault',
      'assets/game/Links_Default.png',
      'assets/game/Links_Default.json'
    );
    //load the collision between the background and the player
    this.load.json(
      'playerCollisionBackgroundData',
      'assets/game/player_house_collision_background.json'
    );

    //load an invisible sprite for the hitbox detection for the change of scene
    this.load.image('sceneTransitionSprite', 'assets/game/hitbox.png');

    this.load.atlas(
      'youngMan',
      'assets/game/young_man.png',
      'assets/game/young_man.json'
    );

    this.load.text('fontCSS', '/assets/fonts/Pixelify_Sans/PixelifySans-VariableFont_wght.ttf');
  }

  create() {
    this.background = this.add.image(0, 0, 'Player_background');
    this.background.setOrigin(0, 0); // Origin top left
    this.background.setScale(this.scaleOfTheGame);

    const initialPlayerX = 209 * this.scaleOfTheGame; // Set your desired initial X position
    const initialPlayerY = 214 * this.scaleOfTheGame; // Set your desired initial Y position

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
      'playerCollisionBackgroundData'
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
      200,
      235,
      409,
      1364
    );

    const Npc = this.npcService.createNpc(
      this,
      this.scaleOfTheGame,
      170,
      165,
      'youngMan',
      this.player,
      false,
      0.5,
      'young_man_text'
    );
  }

  override update() {
    this.movementService.movePlayer(this.player, this.scaleOfTheGame);
  }
}
