import { Injectable } from '@angular/core';
import { guestBookCommentary } from '../../../models/guestBookCommentary.enum';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private commentOverlapping: boolean = false;
  private containers: {
    container: Phaser.GameObjects.Container;
    width: number;
    height: number;
  }[] = [];

  constructor() {}

  displayComments(scaleOfTheGame: number, scene: Phaser.Scene) {
    this.mockMessages.forEach((message) => {
      this.createComment(message, scaleOfTheGame, scene);
    });
  }

  createClickableBook(
    x: number,
    y: number,
    scaleOfTheGame: number,
    player: Phaser.Physics.Arcade.Sprite,
    scene: Phaser.Scene
  ) {
    const openBook = scene.physics.add.sprite(
      scaleOfTheGame * x,
      scaleOfTheGame * y,
      'openBook'
    );
    openBook.setScale(scaleOfTheGame);
    openBook.setInteractive({ useHandCursor: true });
    openBook.body.immovable = true;

    openBook.on('pointerdown', () => {
      this.showForm();
    });

    scene.physics.add.collider(player, openBook);

    return openBook;
  }

  createComment(
    message: guestBookCommentary,
    scaleOfTheGame: number,
    scene: Phaser.Scene
  ) {
    const formattedText = `${
      message.user
    }   -   (${message.date.toLocaleDateString()})\n\n${message.message}`;

    const fixedWidth = 131 * scaleOfTheGame;
    const fixedHeight = 44 * scaleOfTheGame;

    // create the box for the text
    const container = scene.add.container(
      message.x * scaleOfTheGame,
      message.y * scaleOfTheGame
    );

    // create the background graphics
    const backgroundGraphics = this.createBackgroundGraphics(
      scene,
      fixedWidth,
      fixedHeight,
      0xcccccc
    );
    container.add(backgroundGraphics);

    const fontSize = 4 * scaleOfTheGame;
    const fontSizeString = fontSize + 'px';

    const text = scene.add.text(0, 0, formattedText, {
      fontFamily: 'Pixelify_Sans',
      fontSize: fontSizeString,
      color: '#000000',
      padding: { x: 10, y: 15 },
      wordWrap: { width: fixedWidth - 20 },
      align: 'left',
    });

    container.add(text);

    // create the border graphics
    const borderGraphics = scene.add.graphics();
    borderGraphics.lineStyle(3, 0x333333, 1);
    borderGraphics.strokeRect(0, 0, fixedWidth, fixedHeight); // size of the box
    container.add(borderGraphics);

    text.setOrigin(0, 0);
    text.setDepth(1);

    if (message.newComment) {
      // Enable dragging for the container
      container.setInteractive(
        new Phaser.Geom.Rectangle(0, 0, fixedWidth, fixedHeight),
        Phaser.Geom.Rectangle.Contains
      );

      scene.input.setDraggable(container);

      container.on(
        'drag',
        (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
          container.x = dragX;
          container.y = dragY;
          this.checkOverlap(container, fixedWidth, fixedHeight, scene, scaleOfTheGame);
        }
      );
    }

    this.containers.push({ container, width: fixedWidth, height: fixedHeight });
  }

  createBackgroundGraphics(
    scene: Phaser.Scene,
    width: number,
    height: number,
    color: number
  ) {
    const graphics = scene.add.graphics();
    graphics.fillStyle(color, 1);
    graphics.fillRect(0, 0, width, height);
    return graphics;
  }

  checkOverlap(
    container: Phaser.GameObjects.Container,
    width: number,
    height: number,
    scene: Phaser.Scene,
    scaleOfTheGame: number
  ) {
    this.commentOverlapping = false;
    const containerBounds = new Phaser.Geom.Rectangle(
      container.x,
      container.y,
      width,
      height
    );

    // Check overlap with the restricted zone
    const restrictedZone = new Phaser.Geom.Rectangle(-10*scaleOfTheGame, -10*scaleOfTheGame, 228*scaleOfTheGame, 132*scaleOfTheGame);
    if (
      Phaser.Geom.Intersects.RectangleToRectangle(
        containerBounds,
        restrictedZone
      )
    ) {
      this.commentOverlapping = true;
    }

    // Check overlap with other comments
    this.containers.forEach((other) => {
      if (other.container !== container) {
        const otherBounds = new Phaser.Geom.Rectangle(
          other.container.x,
          other.container.y,
          other.width,
          other.height
        );
        if (
          Phaser.Geom.Intersects.RectangleToRectangle(
            containerBounds,
            otherBounds
          )
        ) {
          this.commentOverlapping = true;
        }
      }
    });

    this.updateCommentAppearance(container, width, height);
  }

  updateCommentAppearance(
    container: Phaser.GameObjects.Container,
    width: number,
    height: number
  ) {
    const backgroundGraphics = container.getAt(
      0
    ) as Phaser.GameObjects.Graphics;

    backgroundGraphics.clear();
    if (this.commentOverlapping) {
      backgroundGraphics.fillStyle(0xff9999, 1); // Red color for overlap
    } else {
      backgroundGraphics.fillStyle(0xcccccc, 1); // Default color
    }
    backgroundGraphics.fillRect(0, 0, width, height);
  }

  moveComment() {}

  //hideForm() in comment-form.component
  showForm() {
    const form = document.getElementById('messageForm');
    if (form) {
      form.classList.remove('hidden');
    }
  }

  private mockMessages: guestBookCommentary[] = [
    {
      user: 'test1',
      message:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum in tincidunt odio. Vivamus id justo sed ante viverra cursus. Etiam eget finibus quam. Proin vulputate dictum feugiat. Int',
      date: new Date('2022-11-05T10:30:00'),
      x: -100,
      y: 200,
    },
    {
      user: 'test2',
      message:
        'm mollis. Etiam purus quam, porta eu sodales hendrerit, imperdiet eget purus. Vivamus tempor metus ut ante malesuada, eu malesuada nibh vehicula. Aliquam pulvinar quis tellus ac facilisis. Quisque fringilla porta lobortis. Vestibulum vitae urna tempor, viverra leo at, molestie ma',
      date: new Date('2023-12-11T10:30:00'),
      x: 200,
      y: 200,
    },
    {
      user: 'test3',
      message:
        'd non faucibus purus. Etiam dignissim libero sed lacinia pellentesque. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ut pellentesque ligula, id aliquet nisi. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque a viverra turpis, eu finibus neque. Integer tincidunt tortor nibh, sit amet fringilla dui pulvinar non. Orci varius natoque penatibus et magnis dis parturient monte',
      date: new Date('2024-06-30T10:30:00'),
      x: 300,
      y: 300,
    },
    {
      user: 'test4',
      message: 'rnare dapibus. In feugiat eget lorem at loborti',
      date: new Date('2023-12-25T10:30:00'),
      x: 400,
      y: 400,
    },
  ];
}
