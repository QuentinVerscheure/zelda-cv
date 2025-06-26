import { Injectable } from '@angular/core';
import { AchievementService } from '../../../services/achievement.service';
import { Achievement } from '../../../models/achievement.model';
import { ApiService } from '../../../services/api.service';
import { GuestBookComment } from '../../../models/guestBookComment.model';
import { MenuMessageService } from '../../../components/menu/menu-message.service';
import { CommentDTO } from '../../../models/dto/comment.dto';
import { CommentContainer } from '../../../models/commentContainer.model';
import { SessionStorageService } from '../../../services/session-storage.service';

@Injectable({
  providedIn: 'root',
})
//service to manage comments in the guest book scene
// it allows to create, display, edit and delete comments in the scene
export class CommentService {
  private commentContainers: Phaser.GameObjects.Container[] = [];

  constructor(
    private achievementService: AchievementService,
    private apiService: ApiService,
    private menuMessageService: MenuMessageService,
    private sessionStorageService: SessionStorageService
  ) {}

  displayComments(scaleOfTheGame: number, scene: Phaser.Scene) {
    this.apiService.getAllComments().subscribe((guestBookDtos) => {
      guestBookDtos.forEach((guestBookDto) => {
        this.createComment(guestBookDto, scaleOfTheGame, scene);
      });
    });
  }

  /**
   *  create a clickable icon in the scene
   * @param x - x position of the icon
   * @param y - y position of the icon
   * @param scaleOfTheGame - scale of the game
   * @param player - the player object for collisions
   * @param scene - the current scene
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
      this.sessionStorageService.syncPseudoWithToken();
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
   *  create a comment in the scene
   * @param guestBookComment - the comment to create
   * @param scaleOfTheGame - scale of the game
   * @param scene - the current scene
   */
  createComment(
    guestBookComment: GuestBookComment,
    scaleOfTheGame: number,
    scene: Phaser.Scene
  ) {
    //format the date of the comment from DB or create a new date if not provided
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

    // fixe dimentions of the message. DO NOT CHANGE. 
    // the back system will continue to check collision with this original defined width and height
    // also if you change it in back, the back can't remember the dimentions of the olds messages and will not be able 
    // to check collision with old and new dimentions
    // in front, it's a visual detection but back will take the origin of the message and calculate
    // the dimention of the message to check collision
    const fixedWidth = 131 * scaleOfTheGame; 
    const fixedHeight = 44 * scaleOfTheGame; 

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

    //is lessage have been created by the user, add a trash icon to delete it
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

    //if new comment or comment created by the user, allow to drag and drop the comment
    text.setOrigin(0, 0);
    text.setDepth(1);
    if (guestBookComment.newComment || guestBookComment.userPseudo === sessionStorage.getItem('pseudo')) {
      container.setInteractive(
        new Phaser.Geom.Rectangle(0, 0, fixedWidth, fixedHeight),
        Phaser.Geom.Rectangle.Contains
      );
      scene.input.setDraggable(container);

      //when comment is dragged, check if it overlaps with the restricted zone (check base on visual detection)
      container.on(
        'drag',
        (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
          container.x = dragX;
          container.y = dragY;
          this.checkOverlap(container, fixedWidth, fixedHeight, scaleOfTheGame);
        }
      );
      // when comment is dropped, check if it overlaps with the restricted zone (check base on visual detection)
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

    // allow the comment to be edited by the user
    if (guestBookComment.userPseudo === sessionStorage.getItem('pseudo')) {
      text.setInteractive({ useHandCursor: true });
      let isEditing = false;

      //recreate the edition of text in order to modify the comment directly in the game 
      text.on('pointerdown', () => {
        if (isEditing) return;
        isEditing = true;

        // disable player movement while editing
        if (scene && 'isEditingComment' in scene) {
          (scene as any).isEditingComment = true;
        }

        text.setColor('#007bff');
        let currentText = guestBookComment.comment;

        if (scene.input.keyboard) {
          const originalText = guestBookComment.comment;
          const keyListener = (event: KeyboardEvent) => {
            if (!isEditing) return;

            if (event.key === 'Enter') {
              isEditing = false;
              text.setColor('#000000');
              guestBookComment.comment = currentText;
              text.setText(`${guestBookComment.userPseudo}   -   (${dateObj.toLocaleDateString()})\n\n${currentText}`);
              scene.input.keyboard?.off('keydown', keyListener);
              // reactivate player movement
              if (scene && 'isEditingComment' in scene) {
                (scene as any).isEditingComment = false;
              }
              if (guestBookComment.id !== undefined) {
                this.apiService.updateComment(guestBookComment.id, guestBookComment).subscribe();
              }
            } else if (event.key === 'Escape') {
              isEditing = false;
              text.setColor('#000000');
              currentText = originalText;
              text.setText(`${guestBookComment.userPseudo}   -   (${dateObj.toLocaleDateString()})\n\n${originalText}`);
              scene.input.keyboard?.off('keydown', keyListener);
              // reactivate player movement
              if (scene && 'isEditingComment' in scene) {
                (scene as any).isEditingComment = false;
              }
            } else if (event.key === 'Backspace') {
              currentText = currentText.slice(0, -1);
              text.setText(`${guestBookComment.userPseudo}   -   (${dateObj.toLocaleDateString()})\n\n${currentText}_`);
            } else if (event.key.length === 1) {
              currentText += event.key;
              text.setText(`${guestBookComment.userPseudo}   -   (${dateObj.toLocaleDateString()})\n\n${currentText}_`);
            }
          };
          scene.input.keyboard.on('keydown', keyListener);
        }
      });
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
   *  check if the comment container overlaps with the restricted zone or other comments
   * @param container - the comment container to check
   * @param width - width of the comment container
   * @param height - height of the comment container
   * @param scaleOfTheGame - scale of the game
   * @returns true if the comment container does not overlap with any restricted zone or other comments
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
   *  update the appearance of the comment container based on whether it overlaps with restricted zones or other comments
   * @param container - the comment container to update
   * @param width - width of the comment container
   * @param height - height of the comment container
   * @param isOverlapping - true if the comment container overlaps with restricted zones or other comments
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
