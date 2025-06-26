import { Component } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { CommentService } from '../../game/scenes/guestBookHouse/comment.service';
import { SceneGuestBookService2 } from '../../game/scenes/guestBookHouse/scene-guest-book2.service';
import { GuestBookComment } from '../../models/guestBookComment.model';
import { MovementService } from '../../game/core/movement.service';

@Component({
  selector: 'app-comment-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './comment-form.component.html',
  styleUrl: './comment-form.component.scss',
})
export class CommentFormComponent {
  constructor(
    private sceneGuestBookService2: SceneGuestBookService2,
    private commentService: CommentService,
    private movementService: MovementService
  ) {}

  onSubmit(form: NgForm) {
    let pseudo = sessionStorage.getItem('pseudo')!;
    if (pseudo) {
      let guestBookComment: GuestBookComment = {
        userPseudo: pseudo,
        comment: form.value.message,
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
      this.hideForm();
    }
  }

  disablePhaserKeyDownEvent() {
    if (this.sceneGuestBookService2 && 'isEditingComment' in this.sceneGuestBookService2) {
      (this.sceneGuestBookService2 as any).isEditingComment = true;
    }
    this.movementService.disableMovementKeys();

    // forbid Phaser keydown events when the textarea is focused
    window.addEventListener('keydown', this.stopPhaserKeydown, true);
  }

  enablePhaserKeyDownEvent() {
    if (this.sceneGuestBookService2 && 'isEditingComment' in this.sceneGuestBookService2) {
      (this.sceneGuestBookService2 as any).isEditingComment = false;
    }
    this.movementService.enableMovementKeys();

    // autorise Phaser keydown events when the textarea is blurred
    window.removeEventListener('keydown', this.stopPhaserKeydown, true);
  }

  private stopPhaserKeydown = (event: KeyboardEvent) => {
    const active = document.activeElement;
    if (active && active.id === 'message') {
      event.stopImmediatePropagation();
    }
  };

  //showForm() in comment.service
  hideForm() {
    const form = document.getElementById('messageForm');
    if (form) {
      form.classList.add('hidden');
    }
  }
}
