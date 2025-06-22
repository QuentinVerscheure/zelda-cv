import { Component } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { CommentService } from '../../game/scenes/guestBookHouse/comment.service';
import { SceneGuestBookService2 } from '../../game/scenes/guestBookHouse/scene-guest-book2.service';
import { GuestBookComment } from '../../models/guestBookComment.model';

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
    private commentService: CommentService
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

  //showForm() in comment.service
  hideForm() {
    const form = document.getElementById('messageForm');
    if (form) {
      form.classList.add('hidden');
    }
  }
}
