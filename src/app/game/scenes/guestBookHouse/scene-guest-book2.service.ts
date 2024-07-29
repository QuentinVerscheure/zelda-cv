import { Injectable } from '@angular/core';
import { MovementService } from '../../core/movement.service';
import { CollisionService } from '../../core/collision.service';
import { PlayerService } from '../../core/player.service';
import { guestBookCommentary } from '../../../models/guestBookCommentary.enum';

@Injectable({
  providedIn: 'root',
})
export class SceneGuestBookService2 extends Phaser.Scene {
  private infiniteBackground!: Phaser.GameObjects.TileSprite;
  private background!: Phaser.GameObjects.Image;
  private player!: Phaser.Physics.Arcade.Sprite;
  private scaleOfTheGame: number = 4;

  constructor(
    private movementService: MovementService,
    private collisionService: CollisionService,
    private playerService: PlayerService
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

    const initialPlayerX = 56 * this.scaleOfTheGame;
    const initialPlayerY = 70 * this.scaleOfTheGame;

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

    if (this.input.keyboard) {
      this.movementService.initializeKeyboardInput(this.input);
    }

    this.collisionService.createSceneTransitionCollision(
      this,
      this.scaleOfTheGame,
      this.player,
      'sceneTransitionSprite',
      'sceneGuestBook1',
      48,
      40,
      88,
      20,
      'walkingDown/frame0001'
    );

    this.displayComments();
  }

  override update() {
    this.movementService.movePlayer(this.player, this.scaleOfTheGame);
  }

  displayComments() {
    this.mockMessages.forEach((message) => {
      const formattedText = `${message.user} - (${message.date.toLocaleDateString()})\n\n${message.message}`;
  
      const text = this.add.text(
        message.x * this.scaleOfTheGame,
        message.y * this.scaleOfTheGame,
        formattedText,
        {
          fontFamily: 'Pixelify_Sans',
          fontSize: '16px',
          color: '#000000',
          backgroundColor: '#ded4d4',
          padding: { x: 10, y: 5 },
          wordWrap: { width: 300 },
          align: 'left',
        }
      );
  
      text.setOrigin(0, 0);
      text.setDepth(1); 
    });
  }

  createComment(){
    
  }

  private mockMessages : guestBookCommentary[] =
  [
    {
      user: 'test1',
      message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum in tincidunt odio. Vivamus id justo sed ante viverra cursus. Etiam eget finibus quam. Proin vulputate dictum feugiat. Int',
      date: new Date('2022-11-05T10:30:00'),
      x: 100,
      y: 100
    },
    {
      user: 'test2',
      message: 'm mollis. Etiam purus quam, porta eu sodales hendrerit, imperdiet eget purus. Vivamus tempor metus ut ante malesuada, eu malesuada nibh vehicula. Aliquam pulvinar quis tellus ac facilisis. Quisque fringilla porta lobortis. Vestibulum vitae urna tempor, viverra leo at, molestie ma',
      date: new Date('2023-12-11T10:30:00'),
      x: 200,
      y: 200
    },
    {
      user: 'test3',
      message: 'd non faucibus purus. Etiam dignissim libero sed lacinia pellentesque. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ut pellentesque ligula, id aliquet nisi. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque a viverra turpis, eu finibus neque. Integer tincidunt tortor nibh, sit amet fringilla dui pulvinar non. Orci varius natoque penatibus et magnis dis parturient monte',
      date: new Date('2024-06-30T10:30:00'),
      x: 300,
      y: 300
    },
    {
      user: 'test4',
      message: 'rnare dapibus. In feugiat eget lorem at loborti',
      date: new Date('2023-12-25T10:30:00'),
      x: 400,
      y: 400
    },
  ] 
}
