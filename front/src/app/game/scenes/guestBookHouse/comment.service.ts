import { Injectable } from '@angular/core';
import { AchievementService } from '../../../services/achievement.service';
import { Achievement } from '../../../models/achievement.model';
import { ApiService } from '../../../services/api.service';
import { GuestBookComment } from '../../../models/guestBookComment.model';
import { MenuMessageService } from '../../../components/menu/menu-message.service';
import { CommentDTO } from '../../../models/dto/comment.dto';
import { CommentContainer } from '../../../models/commentContainer.model';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private commentContainers: Phaser.GameObjects.Container[] = [];

  constructor(
    private achievementService: AchievementService,
    private apiService: ApiService,
    private menuMessageService: MenuMessageService
  ) {}

  displayComments(scaleOfTheGame: number, scene: Phaser.Scene) {
    this.apiService.getAllComments().subscribe((guestBookDtos) => {
      guestBookDtos.forEach((guestBookDto) => {
        this.createComment(guestBookDto, scaleOfTheGame, scene);
      });
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
      let pseudo = sessionStorage.getItem('pseudo');
      const token = localStorage.getItem('accessToken');

      if (!pseudo || !token) {
        const errorMessage =
          'Merci de vous authentifier/inscrire avant de poster un message';
        this.menuMessageService.showAuthMessage(errorMessage);
      } else {
        this.achievementService.mergeAchievementsAndSave({
          guestBookComment: true,
        } as Achievement);
        this.showForm();
      }
    });

    scene.physics.add.collider(player, icon);

    return icon;
  }

  /**
   *  create a message from the database in the scene
   * @param guestBookCommentary - content of one message
   */
  createComment(
    guestBookComment: GuestBookComment,
    scaleOfTheGame: number,
    scene: Phaser.Scene
  ) {
    let dateObj: Date;
    if (guestBookComment.date instanceof Date) {
      dateObj = guestBookComment.date;
    } else if (
      typeof guestBookComment.date === 'string' ||
      typeof guestBookComment.date === 'number'
    ) {
      dateObj = new Date(guestBookComment.date);
    } else {
      dateObj = new Date();
    }

    const formattedText = `${
      guestBookComment.userPseudo
    }   -   (${dateObj.toLocaleDateString()})\n\n${guestBookComment.comment}`;

    const fixedWidth = 131 * scaleOfTheGame; //fixe width of the message. Do not change
    const fixedHeight = 44 * scaleOfTheGame; //fixe height of the message. Do not change

    const container : CommentContainer = scene.add.container(
      guestBookComment.coordinateX * scaleOfTheGame,
      guestBookComment.coordinateY * scaleOfTheGame,
    );

    container.date = dateObj;

    if (guestBookComment.id != null) {
      (container as CommentContainer).commentId = guestBookComment.id; // Attach the id of the comment directly to the container
    }

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

    // Ajoute ce bloc à la place de la création/ajout du trashIcon
    if (guestBookComment.userPseudo === sessionStorage.getItem('pseudo')) {
      const trashIcon = scene.add
        .image(fixedWidth - 20, 20, 'trashIcon')
        .setScale(scaleOfTheGame / 2);
      trashIcon.setInteractive({ useHandCursor: true });
      container.add(trashIcon);

      trashIcon.on('pointerdown', () => {
        if (container.commentId !== undefined) {
          this.apiService.deleteComment(container.commentId).subscribe();
        }
        container.destroy();
        this.commentContainers = this.commentContainers.filter(
          (c) => c !== container
        );
      });
    }

    text.setOrigin(0, 0);
    text.setDepth(1);
    if (guestBookComment.newComment || guestBookComment.userPseudo === sessionStorage.getItem('pseudo')) {
      container.setInteractive(
        new Phaser.Geom.Rectangle(0, 0, fixedWidth, fixedHeight),
        Phaser.Geom.Rectangle.Contains
      );

      scene.input.setDraggable(container);

      //when comment is dragged, check if it overlaps with the restricted zone (visuel uniquement)
      container.on(
        'drag',
        (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
          container.x = dragX;
          container.y = dragY;
          this.checkOverlap(container, fixedWidth, fixedHeight, scaleOfTheGame);
        }
      );
      // when comment is dropped, check if it overlaps with the restricted zone (visual only)
      container.on(
        'dragend',
        (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
          if (
            !this.checkOverlap(
              container,
              fixedWidth,
              fixedHeight,
              scaleOfTheGame
            )
          ) {
            // If overlap, do nothing
            return;
          }
          const commentId = (container as CommentContainer).commentId;
          const commentDto: CommentDTO = {
            comment: guestBookComment.comment,
            coordinateX: container.x/scaleOfTheGame,
            coordinateY: container.y/scaleOfTheGame,
            date: (container as CommentContainer).date,
            id: commentId,
          };
          const token = localStorage.getItem('accessToken');
          if (!token) {
            this.menuMessageService.showAuthMessage(
              'Vous devez être authentifié pour modifier un commentaire.'
            );
            return;
          }

          if (commentId) {
            this.apiService.updateComment(commentId, commentDto).subscribe();
          } else {
            this.apiService
              .createComment(commentDto)
              .subscribe((createdCommentDto: CommentDTO) => {
                (container as CommentContainer).commentId =
                  createdCommentDto.id;
              });
          }
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
  ): boolean {
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
      175 * scaleOfTheGame
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
    return !isOverlapping;
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
}
