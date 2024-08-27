import { Injectable } from '@angular/core';
import { guestBookCommentary } from '../../../models/guestBookCommentary.enum';
import { ValidAchievementService } from '../../core/valid-achievement.service';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private commentContainers: Phaser.GameObjects.Container[] = [];

  constructor(private validAchievementService: ValidAchievementService) {}

  displayComments(scaleOfTheGame: number, scene: Phaser.Scene) {
    this.mockMessages.forEach((message) => {
      this.createComment(message, scaleOfTheGame, scene);
    });
  }

  /**
   *  create the icon use to display the create comment form
   */
  createClickableIcon(
    x: number,
    y: number,
    scaleOfTheGame: number,
    player: Phaser.Physics.Arcade.Sprite,
    scene: Phaser.Scene
  ) {
    const icon = scene.physics.add.sprite(
      scaleOfTheGame * x,
      scaleOfTheGame * y,
      'openBook'
    );
    icon.setScale(scaleOfTheGame);
    icon.setInteractive({ useHandCursor: true });
    icon.body.immovable = true;

    icon.on('pointerdown', () => {
      this.validAchievementService.ValidAchievement('postComment');
      this.showForm();
    });

    scene.physics.add.collider(player, icon);

    return icon;
  }

  /**
   *  create a message from the database in the scene
   * @param guestBookCommentary - content of one message
   */
  createComment(
    message: guestBookCommentary,
    scaleOfTheGame: number,
    scene: Phaser.Scene
  ) {
    const formattedText = `${
      message.user
    }   -   (${message.date.toLocaleDateString()})\n\n${message.message}`;

    const fixedWidth = 131 * scaleOfTheGame; //fixe width of the message. Do not change
    const fixedHeight = 44 * scaleOfTheGame; //fixe height of the message. Do not change

    const container = scene.add.container(
      message.x * scaleOfTheGame,
      message.y * scaleOfTheGame
    );

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

    const borderGraphics = scene.add.graphics();
    borderGraphics.lineStyle(3, 0x333333, 1);
    borderGraphics.strokeRect(0, 0, fixedWidth, fixedHeight);
    container.add(borderGraphics);

    //trashIcon to delete his message
    const trashIcon = scene.add
      .image(fixedWidth - 20, 20, 'trashIcon')
      .setScale(scaleOfTheGame / 2);
    trashIcon.setInteractive({ useHandCursor: true });
    container.add(trashIcon);

    trashIcon.on('pointerdown', () => {
      container.destroy();
      this.commentContainers = this.commentContainers.filter(
        (c) => c !== container
      );
    });

    text.setOrigin(0, 0);
    text.setDepth(1);

    if (message.newComment) {
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
          this.checkOverlap(container, fixedWidth, fixedHeight, scaleOfTheGame);
        }
      );
    }

    this.commentContainers.push(container);
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

  /**
   *  check if the drag and drop message overlaps another message
   */
  checkOverlap(
    container: Phaser.GameObjects.Container,
    width: number,
    height: number,
    scaleOfTheGame: number
  ) {
    const containerBounds = new Phaser.Geom.Rectangle(
      container.x,
      container.y,
      width,
      height
    );

    let isOverlapping = false;

    // Check overlap with the central restricted zone
    const restrictedZone = new Phaser.Geom.Rectangle(
      -10 * scaleOfTheGame,
      -10 * scaleOfTheGame,
      228 * scaleOfTheGame,
      132 * scaleOfTheGame
    );
    if (
      Phaser.Geom.Intersects.RectangleToRectangle(
        containerBounds,
        restrictedZone
      )
    ) {
      isOverlapping = true;
    }

    this.commentContainers.forEach((otherContainer) => {
      if (otherContainer === container) return; // Ignore self

      const otherBounds = new Phaser.Geom.Rectangle(
        otherContainer.x,
        otherContainer.y,
        width,
        height
      );

      if (
        Phaser.Geom.Intersects.RectangleToRectangle(
          containerBounds,
          otherBounds
        )
      ) {
        isOverlapping = true;
      }
    });

    this.updateCommentAppearance(container, width, height, isOverlapping);
  }

  /**
   *  update the appearance of the message if he overlap something forbidden
   */
  updateCommentAppearance(
    container: Phaser.GameObjects.Container,
    width: number,
    height: number,
    isOverlapping: boolean
  ) {
    const backgroundGraphics = container.getAt(
      0
    ) as Phaser.GameObjects.Graphics;
    backgroundGraphics.clear();

    if (isOverlapping) {
      backgroundGraphics.fillStyle(0xff9999, 1); // Red color for overlap
    } else {
      backgroundGraphics.fillStyle(0xcccccc, 1); // Default color
    }

    backgroundGraphics.fillRect(0, 0, width, height);
  }

  /**
   *  show the form to create the message
   */
  showForm() {
    const form = document.getElementById('messageForm');
    if (form) {
      form.classList.remove('hidden');
    }
  }

  /**
   *  mock message to delete when the database will be implemented
   */
  private mockMessages: guestBookCommentary[] = [
    {
      user: 'test1',
      message:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum in tincidunt odio. Vivamus id justo sed ante viverra cursus. Etiam eget finibus quam. Proin vulputate dictum feugiat. Int',
      date: new Date('2022-11-05T10:30:00'),
      x: -70,
      y: 150,
    },
    {
      user: 'test2',
      message:
        'Lorem ipsum odor amet, consectetuer adipiscing elit. Elementum vel eleifend vestibulum accumsan quisque urna tincidunt potenti. Nostra tristique eleifend class tortor enim integer taciti lacus. Conubia pretium velit montes odio amet inceptos sit vel. Iaculis arcu dolor netus ',
      date: new Date('2023-12-11T10:30:00'),
      x: 200,
      y: 150,
    },
    {
      user: 'test3',
      message:
        'Lorem ipsum odor amet, consectetuer adipiscing elit. Elementum vel eleifend vestibulum accumsan quisque urna tincidunt potenti. Nostra tristique eleifend class tortor enim integer taciti lacus. Conubia pretium velit montes odio amet inceptos sit vel. Iaculis arcu dolor netus vestibulum fermentum. Ornare libero convallis bibendum, praesent ',
      date: new Date('2024-06-30T10:30:00'),
      x: 250,
      y: 50,
    },
    {
      user: 'test4',
      message: 'Lorem ipsum odor amet',
      date: new Date('2023-12-25T10:30:00'),
      x: 0,
      y: 200,
    },
  ];
}
