import { Component, DestroyRef, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgForm, FormsModule } from '@angular/forms';
import { CommentService } from '../../game/scenes/guestBookHouse/comment.service';
import { SceneGuestBookService2 } from '../../game/scenes/guestBookHouse/scene-guest-book2.service';
import { GuestBookComment } from '../../models/guestBookComment.model';
import { MovementService } from '../../game/core/movement.service';
import {
  COMMENT_RULES,
  normalizeCommentText,
} from '../../game/scenes/guestBookHouse/comment-rules';
import { CommentEditRequest, CommentFormService } from './comment-form.service';

/** Form to write a new guestbook message or edit one of the visitor's messages. */
@Component({
    selector: 'app-comment-form',
    imports: [FormsModule],
    templateUrl: './comment-form.component.html',
    styleUrl: './comment-form.component.scss'
})
export class CommentFormComponent implements OnInit {
  readonly rules = COMMENT_RULES;

  readonly visible = signal(false);
  readonly mode = signal<'create' | 'edit'>('create');
  readonly saving = signal(false);
  readonly errorMessage = signal<string | null>(null);

  // the last pseudo used is reused (also shown to the other players in multiplayer)
  pseudo = sessionStorage.getItem('pseudo') ?? '';
  message = '';

  private editRequest: CommentEditRequest | null = null;

  constructor(
    private sceneGuestBookService2: SceneGuestBookService2,
    private commentService: CommentService,
    private commentFormService: CommentFormService,
    private movementService: MovementService,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit() {
    this.commentFormService.createRequest$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.editRequest = null;
        this.mode.set('create');
        this.pseudo = sessionStorage.getItem('pseudo') ?? this.pseudo;
        this.message = '';
        this.open();
      });

    this.commentFormService.editRequest$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((request) => {
        this.editRequest = request;
        this.mode.set('edit');
        this.pseudo = request.pseudo;
        this.message = request.comment;
        this.open();
      });
  }

  hasContent(): boolean {
    return this.pseudo.trim().length > 0 && normalizeCommentText(this.message).length > 0;
  }

  onSubmit(form: NgForm) {
    if (!form.valid || !this.hasContent() || this.saving()) {
      return;
    }
    if (this.mode() === 'edit') {
      this.submitEdit();
    } else {
      this.submitCreate();
    }
  }

  private submitCreate() {
    const pseudo = this.pseudo.trim();
    sessionStorage.setItem('pseudo', pseudo);

    // the message is only saved when the player drops it somewhere in the scene (see CommentService)
    const guestBookComment: GuestBookComment = {
      userPseudo: pseudo,
      comment: normalizeCommentText(this.message),
      date: new Date(),
      coordinateX: 38,
      coordinateY: 34,
      newComment: true,
    };
    this.commentService.createComment(
      guestBookComment,
      this.sceneGuestBookService2.getScaleOfTheGame(),
      this.sceneGuestBookService2
    );
    this.message = '';
    this.hideForm();
  }

  private submitEdit() {
    if (!this.editRequest) {
      return;
    }
    this.saving.set(true);
    this.errorMessage.set(null);
    this.editRequest.submit(normalizeCommentText(this.message)).subscribe({
      next: () => {
        this.saving.set(false);
        this.hideForm();
      },
      error: (err) => {
        this.saving.set(false);
        this.errorMessage.set(
          err?.error?.error || 'Une erreur est survenue, merci de réessayer plus tard'
        );
      },
    });
  }

  private open() {
    this.errorMessage.set(null);
    this.saving.set(false);
    this.visible.set(true);
  }

  disablePhaserKeyDownEvent() {
    if (this.sceneGuestBookService2 && 'isEditingComment' in this.sceneGuestBookService2) {
      (this.sceneGuestBookService2 as any).isEditingComment = true;
    }
    this.movementService.disableMovementKeys();

    // forbid Phaser keydown events when a field of the form is focused
    window.addEventListener('keydown', this.stopPhaserKeydown, true);
  }

  enablePhaserKeyDownEvent() {
    if (this.sceneGuestBookService2 && 'isEditingComment' in this.sceneGuestBookService2) {
      (this.sceneGuestBookService2 as any).isEditingComment = false;
    }
    this.movementService.enableMovementKeys();

    // autorise Phaser keydown events when the form is blurred
    window.removeEventListener('keydown', this.stopPhaserKeydown, true);
  }

  private stopPhaserKeydown = (event: KeyboardEvent) => {
    const active = document.activeElement;
    if (active && (active.id === 'message' || active.id === 'pseudo')) {
      event.stopImmediatePropagation();
    }
  };

  hideForm() {
    this.visible.set(false);
    this.editRequest = null;
    this.errorMessage.set(null);
  }
}
