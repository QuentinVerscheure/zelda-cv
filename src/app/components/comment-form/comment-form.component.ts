import { Component } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { CommentService } from '../../game/scenes/guestBookHouse/comment.service';
import { guestBookCommentary } from '../../models/guestBookCommentary.enum';
import { SceneGuestBookService2 } from '../../game/scenes/guestBookHouse/scene-guest-book2.service';

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
    console.log(form.value);
    let message: guestBookCommentary = {
      user: 'newUser',
      message: form.value.message,
      date: new Date(),
      x: 38,
      y: 34,
    };

    this.commentService.createComment(
      message,
      this.sceneGuestBookService2.getScaleOfTheGame(),
      this.sceneGuestBookService2
    );
  }

  //showForm in comment.service
  hideForm() {
    const form = document.getElementById('messageForm');
    if (form) {
      form.classList.add('hidden');
    }
  }
}
