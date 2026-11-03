import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

/** Edition of an existing (or not yet saved) guestbook message, requested by the game. */
export interface CommentEditRequest {
  pseudo: string;
  comment: string;
  /** Saves the new text; the form closes on success and shows the error message otherwise. */
  submit: (newComment: string) => Observable<void>;
}

/**
 * Lets the Phaser guestbook scene open the Angular message form,
 * either to write a new message or to edit one of the visitor's messages.
 */
@Injectable({
  providedIn: 'root',
})
export class CommentFormService {
  private readonly createRequestSubject = new Subject<void>();
  private readonly editRequestSubject = new Subject<CommentEditRequest>();

  readonly createRequest$ = this.createRequestSubject.asObservable();
  readonly editRequest$ = this.editRequestSubject.asObservable();

  openCreate(): void {
    this.createRequestSubject.next();
  }

  openEdit(request: CommentEditRequest): void {
    this.editRequestSubject.next(request);
  }
}
