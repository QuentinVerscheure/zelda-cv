import { Injectable } from '@angular/core';
import { MovementService } from '../../core/movement.service';
import { CollisionService } from '../../core/collision.service';
import { PlayerService } from '../../core/player.service';
import { AchievementService } from '../../../services/achievement.service';
import { ScaleOfTheGameService } from '../../core/scale-of-the-game.service';
import { Achievement } from '../../../models/achievement.model';
import { PlayerSyncService } from '../../../services/player-sync.service';

@Injectable({
  providedIn: 'root',
})
export class SceneContactService extends Phaser.Scene {
  private background!: Phaser.GameObjects.Image;
  private player!: Phaser.Physics.Arcade.Sprite;
  private scaleOfTheGame: number = ScaleOfTheGameService.getScaleOfTheGame();
  private otherPlayers: Map<string, Phaser.Physics.Arcade.Sprite> = new Map();

  constructor(
    private movementService: MovementService,
    private collisionService: CollisionService,
    private playerService: PlayerService,
    private achievementService: AchievementService,
    private playerSyncService: PlayerSyncService
  ) {
    super({ key: 'sceneContact' });
  }

  preload() {
    this.achievementService.mergeAchievementsAndSave({ phone: true } as Achievement);

    this.load.image(
      'phoneHouse_background',
      'assets/game/Phone_House_Background.png'
    );

    //load the collision between the background and the player
    this.load.json(
      'phoneHouseCollisionBackgroundData',
      'assets/game/phone_house_collision_background.json'
    );

    //load an invisible sprite for the hitbox detection for the change of scene
    this.load.image('sceneTransitionSprite', 'assets/game/hitbox.png');

    this.load.image('message', 'assets/game/message.png');

    this.load.atlas(
      'linkDefault',
      'assets/game/Links_Default.png',
      'assets/game/Links_Default.json'
    );
  }

  create() {
    this.background = this.add.image(0, 0, 'phoneHouse_background');
    this.background.setOrigin(0, 0); // Origin top left
    this.background.setScale(this.scaleOfTheGame);

    const initialPlayerX = 97 * this.scaleOfTheGame; // Set your desired initial X position
    const initialPlayerY = 232 * this.scaleOfTheGame; // Set your desired initial Y position

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
      'phoneHouseCollisionBackgroundData'
    );

    this.movementService.initializeInput(this);

    this.collisionService.createSceneTransitionCollision(
      this,
      this.scaleOfTheGame,
      this.player,
      'sceneTransitionSprite',
      'sceneWorld',
      88,
      246,
      410,
      1490
    );

    //create the clickable icon who display the contact form
    this.createSendMailIcon(95, 90, this.scaleOfTheGame, this.player);

    // Synchronize user's position and other players's position for websocket
    this.playerSyncService.syncPlayers(
      this,
      this.player,
      this.scaleOfTheGame,
      'sceneContact'
    );
  }

  override update() {
    this.movementService.movePlayer(this.player, this.scaleOfTheGame);
  }

  createSendMailIcon(
    x: number,
    y: number,
    scaleOfTheGame: number,
    player: Phaser.Physics.Arcade.Sprite
  ) {
    const icon = this.physics.add.sprite(
      scaleOfTheGame * x,
      scaleOfTheGame * y,
      'message'
    );
    icon.setScale(scaleOfTheGame);
    icon.setInteractive({ useHandCursor: true });
    icon.body.immovable = true;

    icon.on('pointerdown', () => {
      this.achievementService.mergeAchievementsAndSave({ phoneContact: true } as Achievement);
      this.showForm();
    });

    this.physics.add.collider(player, icon);

    return icon;
  }

  showForm() {
    const form = document.getElementById('contact-container');
    if (form) {
      form.classList.remove('hidden');
    }
  }
}
