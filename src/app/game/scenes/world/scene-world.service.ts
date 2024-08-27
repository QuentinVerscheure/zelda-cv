import { Injectable } from '@angular/core';
import { MovementService } from '../../core/movement.service';
import { CollisionService } from '../../core/collision.service';
import { PlayerService } from '../../core/player.service';
import { SceneTransitionCollisionData } from '../../../models/SceneTransitionCollisionData.enum';
import { NpcService } from '../../core/npc.service';
import { ScaleOfTheGameService } from '../../core/scale-of-the-game.service';

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
    private npcService: NpcService
  ) {
    super({ key: 'sceneWorld' });
  }

  preload() {
    this.load.image('worldBackground', 'assets/game/Koholint.png');
    this.load.atlas(
      'linkDefault',
      'assets/game/Links_Default.png',
      'assets/game/Links_Default.json'
    );
    //load the collision between the background and the player
    this.load.json(
      'KoholintCollisionBackgroundData',
      'assets/game/Koholint_collision_background.json'
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
      data?.x * this.scaleOfTheGame || 408 * this.scaleOfTheGame;
    const initialPlayerY =
      data?.y * this.scaleOfTheGame || 1378 * this.scaleOfTheGame;

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
      'KoholintCollisionBackgroundData'
    );

    // Initialize keyboard inputs
    this.movementService.initializeInput(this);

    // create scene transition collision
    let sceneTransitionCollisionData: SceneTransitionCollisionData[] = [
      //[nameOfTheSpriteCollision, sceneToLoad, xOfHitbox, yOfHitbox, startXPositionInNewScene?, startYPositionInNewScene?]
      ['creditHouse', 'sceneCredit', 400, 1082],
      ['creditHouse', 'sceneCredit', 432, 1082],
      ['cvHouse', 'sceneCV', 543, 1226],
      ['playerHouse', 'scenePlayerHouse', 400, 1338],
      ['linkHouse', 'sceneLink', 240, 1322],
      ['variousHouse', 'sceneVarious', 208, 1322],
      ['portfolioHouse', 'scenePortfolio1', 560, 1466],
      ['contactHouse', 'sceneContact', 400, 1466],
      ['guestBookHouse', 'sceneGuestBook1', 224, 1482],
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
      60,
      1400,
      'artist',
      this.player,
      false,
      1
    );
    this.npcService.createNpc(
      this,
      this.scaleOfTheGame,
      320,
      1500,
      'chick',
      this.player,
      false,
      2
    );
    this.npcService.createNpc(
      this,
      this.scaleOfTheGame,
      340,
      1420,
      'chicken',
      this.player,
      false,
      1
    );
    this.npcService.createNpc(
      this,
      this.scaleOfTheGame,
      280,
      1350,
      'dog',
      this.player,
      false,
      2
    );
    this.npcService.createNpc(
      this,
      this.scaleOfTheGame,
      500,
      1400,
      'farmer',
      this.player,
      false,
      0.5
    );
    this.npcService.createNpc(
      this,
      this.scaleOfTheGame,
      460,
      1275,
      'musician1',
      this.player,
      false,
      4
    );
    this.npcService.createNpc(
      this,
      this.scaleOfTheGame,
      450,
      1250,
      'musician2',
      this.player,
      false,
      0.5
    );
    this.npcService.createNpc(
      this,
      this.scaleOfTheGame,
      430,
      1266,
      'musician3',
      this.player,
      false,
      2
    );
    this.npcService.createNpc(
      this,
      this.scaleOfTheGame,
      580,
      1150,
      'old_woman',
      this.player,
      false,
      0.5
    );
  }

  override update() {
    this.movementService.movePlayer(this.player, this.scaleOfTheGame);
  }
}
