import { Injectable } from '@angular/core';
import { MovementService } from '../../core/movement.service';
import { CollisionService } from '../../core/collision.service';
import { PlayerService } from '../../core/player.service';
import { CommentService } from './comment.service';
import { ScaleOfTheGameService } from '../../core/scale-of-the-game.service';

@Injectable({
  providedIn: 'root',
})
export class SceneGuestBookService2 extends Phaser.Scene {
  private infiniteBackground!: Phaser.GameObjects.TileSprite;
  private background!: Phaser.GameObjects.Image;
  private player!: Phaser.Physics.Arcade.Sprite;

  private scaleOfTheGame: number = ScaleOfTheGameService.getScaleOfTheGame();

  constructor(
    private movementService: MovementService,
    private collisionService: CollisionService,
    private playerService: PlayerService,
    private commentService: CommentService
  ) {
    super({ key: 'sceneGuestBook2' });
  }

  preload() {
    this.load.image(
      'Guest_Book_infinit_background2',
      'assets/game/Guest_Book_House_3.png'
    );
    this.load.image(
      'Guest_Book_background2',
      'assets/game/Guest_Book_House_2.png'
    );
    this.load.image('trashIcon', 'assets/game/trash.png');
    this.load.atlas(
      'linkDefault',
      'assets/game/Links_Default.png',
      'assets/game/Links_Default.json'
    );
    //load the collision between the background and the player
    this.load.json(
      'guestBookCollisionBackgroundData2',
      'assets/game/guest_house_2_collision_background.json'
    );

    this.load.image('openBook', 'assets/game/open_book.png');

    //load an invisible sprite for the hitbox detection for the change of scene
    this.load.image('sceneTransitionSprite', 'assets/game/hitbox.png');
  }

  create() {
    this.infiniteBackground = this.add
      .tileSprite(
        0,
        0,
        this.scale.width,
        this.scale.height,
        'Guest_Book_infinit_background2'
      )
      .setScale(this.scaleOfTheGame);

    this.background = this.add
      .image(0, 0, 'Guest_Book_background2')
      .setOrigin(0, 0)
      .setScale(this.scaleOfTheGame);

    const initialPlayerX = 104 * this.scaleOfTheGame;
    const initialPlayerY = 102 * this.scaleOfTheGame;

    this.player = this.playerService.createPlayer(
      this.player,
      this,
      this.scaleOfTheGame,
      initialPlayerX,
      initialPlayerY,
      'walkingDown/frame0001'
    );

    this.collisionService.createWorldCollisions(
      this,
      this.scaleOfTheGame,
      this.player,
      'guestBookCollisionBackgroundData2'
    );

    MovementService.initializeInput(this);

    this.collisionService.createSceneTransitionCollision(
      this,
      this.scaleOfTheGame,
      this.player,
      'sceneTransitionSprite',
      'sceneGuestBook1',
      96,
      72,
      88,
      20,
      'walkingDown/frame0001'
    );

    //create the clickable book who display the comment form
    const openBook = this.commentService.createClickableBook(
      104,
      150,
      this.scaleOfTheGame,
      this.player,
      this
    );
  }

  override update() {
    MovementService.movePlayer(this.player, this.scaleOfTheGame);
    this.commentService.displayComments(this.scaleOfTheGame, this);
  }

  getScaleOfTheGame() {
    return this.scaleOfTheGame;
  }
}
