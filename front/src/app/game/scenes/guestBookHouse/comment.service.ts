import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, map, of, tap } from 'rxjs';
import { AchievementService } from '../../../services/achievement.service';
import { Achievement } from '../../../models/achievement.model';
import { ApiService } from '../../../services/api.service';
import { GuestBookComment } from '../../../models/guestBookComment.model';
import { CommentContainer } from '../../../models/commentContainer.model';
import { CommentPasswordService } from './comment-password.service';
import { CommentFormService } from '../../../components/comment-form/comment-form.service';

@Injectable({
  providedIn: 'root',
})
//service to manage comments in the guest book scene
// it allows to create, display, edit and delete comments in the scene.
// There are no user accounts: a visitor owns a message if this browser holds its password
// (cookie set when the message was created, valid 7 days). The backend checks the password on every change.
export class CommentService {
  private commentContainers: Phaser.GameObjects.Container[] = [];

  constructor(
    private achievementService: AchievementService,
    private apiService: ApiService,
    private commentPasswordService: CommentPasswordService,
    private commentFormService: CommentFormService
  ) {}

  displayComments(scaleOfTheGame: number, scene: Phaser.Scene) {
    // the scene is recreated each time the player enters it: forget the containers of the previous visit
    this.commentContainers = [];
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
      this.commentFormService.openCreate();
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

    const text = scene.add.text(0, 0, this.formatText(guestBookComment, dateObj, guestBookComment.comment), {
      fontFamily: 'Pixelify_Sans',
      fontSize: fontSizeString,
      color: '#000000',
      padding: { x: 10, y: 15 },
      // advanced wrap also breaks the words longer than a line
      wordWrap: { width: fixedWidth - 20, useAdvancedWrap: true },
      align: 'left',
    });
    text.setOrigin(0, 0);
    text.setDepth(1);
    // safety net: the text never goes outside the fixed-size box
    text.setCrop(0, 0, fixedWidth, fixedHeight);

    container.add(text);

    const borderGraphics = scene.add.graphics();
    borderGraphics.lineStyle(3, 0x333333, 1);
    borderGraphics.strokeRect(0, 0, fixedWidth, fixedHeight);
    container.add(borderGraphics);

    this.commentContainers.push(container);

    const ownerContext: OwnerContext = {
      scene,
      container,
      text,
      guestBookComment,
      dateObj,
      scaleOfTheGame,
      fixedWidth,
      fixedHeight,
      password: '',
    };

    if (guestBookComment.newComment) {
      // new message, not saved yet: its password is generated now and stored in a cookie once saved
      ownerContext.password = this.commentPasswordService.generatePassword();
      this.enableOwnerControls(ownerContext);
    } else if (guestBookComment.id != null) {
      // existing message: the visitor owns it if this browser still has a valid password for it
      const commentId = guestBookComment.id;
      const password = this.commentPasswordService.get(commentId);
      if (password) {
        this.apiService.verifyCommentPassword(commentId, password).subscribe({
          next: (response) => {
            if (response.valid) {
              ownerContext.password = password;
              this.enableOwnerControls(ownerContext);
            } else {
              this.commentPasswordService.remove(commentId);
            }
          },
        });
      }
    }
  }

  /**
   * Gives the author of a message the controls to delete it (trash icon), move it (drag and drop)
   * and edit its text (click on it opens the Angular form). Every change is sent with the message's password.
   */
  private enableOwnerControls(ctx: OwnerContext) {
    const { scene, container, guestBookComment, scaleOfTheGame, fixedWidth, fixedHeight } = ctx;

    // last position saved in DB, to put the message back if the backend refuses a move
    let savedPosition = { x: container.x, y: container.y };
    let dragStartPosition = { x: container.x, y: container.y };
    let isSaving = false;
    let isDeleting = false;

    // trash icon to delete the message
    const trashIcon = scene.add
      .image(fixedWidth - 20, 20, 'trashIcon')
      .setScale(scaleOfTheGame / 2);
    trashIcon.setInteractive({ useHandCursor: true });
    container.add(trashIcon);

    trashIcon.on('pointerdown', () => {
      isDeleting = true;
      const commentId = container.commentId;
      if (commentId === undefined) {
        // not saved yet: only remove it from the scene
        this.destroyComment(container);
        return;
      }
      this.apiService.deleteComment(commentId, ctx.password).subscribe({
        next: () => {
          this.commentPasswordService.remove(commentId);
          this.destroyComment(container);
        },
        error: (err) => {
          isDeleting = false;
          this.showError(scene, container, scaleOfTheGame, err);
        },
      });
    });

    // allow to drag and drop the comment
    container.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, fixedWidth, fixedHeight),
      Phaser.Geom.Rectangle.Contains
    );
    container.input!.cursor = 'pointer';
    scene.input.setDraggable(container);

    container.on('dragstart', () => {
      dragStartPosition = { x: container.x, y: container.y };
    });

    //when comment is dragged, check if it overlaps with the restricted zone (check base on visual detection)
    container.on(
      'drag',
      (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
        container.x = dragX;
        container.y = dragY;
        this.checkOverlap(container, fixedWidth, fixedHeight, scaleOfTheGame);
      }
    );
    // a click (no real move) opens the edit form; a drop saves the message (creation or move)
    container.on('dragend', () => {
      if (isDeleting) {
        return;
      }
      const moved = Phaser.Math.Distance.Between(
        dragStartPosition.x,
        dragStartPosition.y,
        container.x,
        container.y
      );
      if (moved < 3) {
        container.x = dragStartPosition.x;
        container.y = dragStartPosition.y;
        this.openEditForm(ctx);
        return;
      }

      if (
        !this.checkOverlap(container, fixedWidth, fixedHeight, scaleOfTheGame) ||
        isSaving
      ) {
        return;
      }

      const coordinateX = Math.round(container.x / scaleOfTheGame);
      const coordinateY = Math.round(container.y / scaleOfTheGame);
      const commentId = container.commentId;
      isSaving = true;

      if (commentId !== undefined) {
        this.apiService
          .updateComment(commentId, {
            comment: guestBookComment.comment,
            coordinateX,
            coordinateY,
            password: ctx.password,
          })
          .subscribe({
            next: () => {
              savedPosition = { x: container.x, y: container.y };
              isSaving = false;
            },
            error: (err) => {
              container.x = savedPosition.x;
              container.y = savedPosition.y;
              this.checkOverlap(container, fixedWidth, fixedHeight, scaleOfTheGame);
              this.showError(scene, container, scaleOfTheGame, err);
              isSaving = false;
            },
          });
      } else {
        this.apiService
          .createComment({
            pseudo: guestBookComment.userPseudo,
            comment: guestBookComment.comment,
            coordinateX,
            coordinateY,
            password: ctx.password,
          })
          .subscribe({
            next: (createdComment) => {
              if (createdComment.id != null) {
                container.commentId = createdComment.id;
                guestBookComment.id = createdComment.id;
                this.commentPasswordService.save(createdComment.id, ctx.password);
              }
              savedPosition = { x: container.x, y: container.y };
              this.achievementService.mergeAchievementsAndSave({
                guestBookComment: true,
              } as Achievement);
              isSaving = false;
            },
            error: (err) => {
              // stays draggable: the visitor can drop it again to retry
              this.showError(scene, container, scaleOfTheGame, err);
              isSaving = false;
            },
          });
      }
    });
  }

  /** Opens the Angular form to edit the text of one of the visitor's messages. */
  private openEditForm(ctx: OwnerContext) {
    const { container, text, guestBookComment, scaleOfTheGame } = ctx;
    this.commentFormService.openEdit({
      pseudo: guestBookComment.userPseudo,
      comment: guestBookComment.comment,
      submit: (newComment: string): Observable<void> => {
        const applyInScene = () => {
          guestBookComment.comment = newComment;
          text.setText(this.formatText(guestBookComment, ctx.dateObj, newComment));
          text.setCrop(0, 0, ctx.fixedWidth, ctx.fixedHeight);
        };
        const commentId = container.commentId;
        if (commentId === undefined) {
          // not saved yet: it will be saved with its new text when dropped
          applyInScene();
          return of(undefined);
        }
        return this.apiService
          .updateComment(commentId, {
            comment: newComment,
            coordinateX: Math.round(container.x / scaleOfTheGame),
            coordinateY: Math.round(container.y / scaleOfTheGame),
            password: ctx.password,
          })
          .pipe(
            tap(() => applyInScene()),
            map(() => undefined)
          );
      },
    });
  }

  private formatText(guestBookComment: GuestBookComment, dateObj: Date, message: string): string {
    return `${guestBookComment.userPseudo}   -   (${dateObj.toLocaleDateString()})\n\n${message}`;
  }

  private destroyComment(container: Phaser.GameObjects.Container) {
    container.destroy();
    this.commentContainers = this.commentContainers.filter(
      (c) => c !== container
    );
  }

  /**
   * Shows the backend error message above the comment for a few seconds
   * (e.g. too many messages, 7-day edit window expired...).
   */
  private showError(
    scene: Phaser.Scene,
    container: Phaser.GameObjects.Container,
    scaleOfTheGame: number,
    err: HttpErrorResponse
  ) {
    const message: string =
      err?.error?.error || 'Une erreur est survenue, merci de réessayer plus tard';
    const errorText = scene.add.text(container.x, container.y - 4 * scaleOfTheGame, message, {
      fontFamily: 'Pixelify_Sans',
      fontSize: 4 * scaleOfTheGame + 'px',
      color: '#ffffff',
      backgroundColor: '#c0392b',
      padding: { x: 6, y: 4 },
      wordWrap: { width: 131 * scaleOfTheGame },
    });
    errorText.setOrigin(0, 1);
    errorText.setDepth(10);
    scene.time.delayedCall(4000, () => errorText.destroy());
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
}

/** What the owner controls of a message need to know about it. */
interface OwnerContext {
  scene: Phaser.Scene;
  container: CommentContainer;
  text: Phaser.GameObjects.Text;
  guestBookComment: GuestBookComment;
  dateObj: Date;
  scaleOfTheGame: number;
  fixedWidth: number;
  fixedHeight: number;
  /** password of the message, sent with every change */
  password: string;
}
