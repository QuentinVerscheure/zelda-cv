import { Injectable } from '@angular/core';
import { MovementService } from '../../core/movement.service';
import { CollisionService } from '../../core/collision.service';
import { PlayerService } from '../../core/player.service';
import { SceneTransitionCollisionData } from '../../../models/SceneTransitionCollisionData.model';
import { NpcService } from '../../core/npc.service';
import { ScaleOfTheGameService } from '../../core/scale-of-the-game.service';
import { WebsocketPlayerService } from '../../../services/websocket-player.service';
import { PlayerPositionDTO } from '../../../models/dto/top-players.dto';
import { PlayerSyncService } from '../../../services/player-sync.service';

@Injectable({
  providedIn: 'root',
})
export class SceneWorldService extends Phaser.Scene {
  private background!: Phaser.GameObjects.Image;
  private player!: Phaser.Physics.Arcade.Sprite;
  private scaleOfTheGame: number =
    ScaleOfTheGameService.getScaleOfTheGame() / 2;

  constructor(
    private movementService: MovementService,
    private collisionService: CollisionService,
    private playerService: PlayerService,
    private npcService: NpcService,
    private websocketPlayerService: WebsocketPlayerService,
    private playerSyncService: PlayerSyncService
  ) {
    super({ key: 'sceneWorld' });
  }

  preload() {
    this.load.image('worldBackground', 'assets/game/world.png');
    this.load.atlas(
      'linkDefault',
      'assets/game/Links_Default.png',
      'assets/game/Links_Default.json'
    );
    //load the collision between the background and the player
    this.load.json(
      'worldBackgroundData',
      'assets/game/world_collision_background.json'
    ); //background collision map file

    //npc
    this.load.atlas(
      'artist',
      'assets/game/artist.png',
      'assets/game/artist.json'
    );
    this.load.atlas('chick', 'assets/game/chick.png', 'assets/game/chick.json');
    this.load.atlas(
      'chicken',
      'assets/game/chicken.png',
      'assets/game/chicken.json'
    );
    this.load.atlas('dog', 'assets/game/dog.png', 'assets/game/dog.json');
    this.load.atlas(
      'farmer',
      'assets/game/farmer.png',
      'assets/game/farmer.json'
    );
    this.load.atlas(
      'musician1',
      'assets/game/musician1.png',
      'assets/game/musician1.json'
    );
    this.load.atlas(
      'musician2',
      'assets/game/musician2.png',
      'assets/game/musician2.json'
    );
    this.load.atlas(
      'musician3',
      'assets/game/musician3.png',
      'assets/game/musician3.json'
    );
    this.load.atlas(
      'old_woman',
      'assets/game/old_woman.png',
      'assets/game/old_woman.json'
    );

    //load an invisible sprite for the hitbox detection for the change of scene
    const houseNames = [
      'creditHouse',
      'cvHouse',
      'playerHouse',
      'linkHouse',
      'variousHouse',
      'portfolioHouse',
      'contactHouse',
      'guestBookHouse',
    ];
    houseNames.forEach((house) => {
      this.load.image(house, 'assets/game/hitbox.png');
    });
  }

  create(data: { x: number; y: number }) {
    this.background = this.add.image(0, 0, 'worldBackground');
    this.background.setOrigin(0, 0); // Origin top left
    this.background.setScale(this.scaleOfTheGame);

    //coordonate depanding of the scene transition
    const initialPlayerX =
      data?.x * this.scaleOfTheGame || 1045 * this.scaleOfTheGame;
    const initialPlayerY =
      data?.y * this.scaleOfTheGame || 970 * this.scaleOfTheGame;

    this.player = this.playerService.createPlayer(
      this.player,
      this,
      this.scaleOfTheGame,
      initialPlayerX,
      initialPlayerY,
      'walkingDown/frame0001'
    );

    // load the background collision map
    this.collisionService.createWorldCollisions(
      this,
      this.scaleOfTheGame,
      this.player,
      'worldBackgroundData'
    );

    // Initialize keyboard inputs
    this.movementService.initializeInput(this);

    // create scene transition collision
    let sceneTransitionCollisionData: SceneTransitionCollisionData[] = [
      //[nameOfTheSpriteCollision, sceneToLoad, xOfHitbox, yOfHitbox, startXPositionInNewScene?, startYPositionInNewScene?]
      ['creditHouse', 'sceneCredit', 1112, 799],
      ['cvHouse', 'sceneCV', 1096, 943],
      ['playerHouse', 'scenePlayerHouse', 792, 895],
      ['linkHouse', 'sceneLink', 984, 927],
      ['variousHouse', 'sceneVarious', 952, 927],
      ['portfolioHouse', 'scenePortfolio1', 1112, 1039],
      ['contactHouse', 'sceneContact', 953, 1040],
      ['guestBookHouse', 'sceneGuestBook1', 808, 1055],
    ];

    for (const data of sceneTransitionCollisionData) {
      this.collisionService.createSceneTransitionCollision(
        this,
        this.scaleOfTheGame,
        this.player,
        data[0],
        data[1],
        data[2],
        data[3]
      );
    }

    this.npcService.createNpc(
      this,
      this.scaleOfTheGame,
      605,
      960,
      'artist',
      this.player,
      false,
      1
    );
    this.npcService.createNpc(
      this,
      this.scaleOfTheGame,
      1100,
      850,
      'chick',
      this.player,
      false,
      2
    );
    this.npcService.createNpc(
      this,
      this.scaleOfTheGame,
      1150,
      870,
      'chicken',
      this.player,
      false,
      1
    );
    this.npcService.createNpc(
      this,
      this.scaleOfTheGame,
      950,
      1105,
      'dog',
      this.player,
      false,
      2
    );
    this.npcService.createNpc(
      this,
      this.scaleOfTheGame,
      840,
      930,
      'farmer',
      this.player,
      false,
      0.5
    );
    this.npcService.createNpc(
      this,
      this.scaleOfTheGame,
      925,
      815,
      'musician1',
      this.player,
      false,
      4
    );
    this.npcService.createNpc(
      this,
      this.scaleOfTheGame,
      940,
      795,
      'musician2',
      this.player,
      false,
      0.5
    );
    this.npcService.createNpc(
      this,
      this.scaleOfTheGame,
      960,
      815,
      'musician3',
      this.player,
      false,
      2
    );
    this.npcService.createNpc(
      this,
      this.scaleOfTheGame,
      925,
      1075,
      'old_woman',
      this.player,
      false,
      0.5
    );

    // Synchronize user's position and other players's position for websocket
    this.playerSyncService.syncPlayers(
      this,
      this.player,
      this.scaleOfTheGame,
      'sceneWorld'
    );
  }

  override update() {
    this.movementService.movePlayer(this.player, this.scaleOfTheGame);
  }
}
