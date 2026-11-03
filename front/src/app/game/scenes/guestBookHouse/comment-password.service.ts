import { Injectable } from '@angular/core';
import { CookieService } from '../../../services/cookie.service';
import { COMMENT_RULES } from './comment-rules';

/**
 * Passwords of the guestbook messages written from this browser.
 * There are no user accounts: when a visitor creates a message, a random password is generated here,
 * sent to the backend (which stores its hash) and kept in a cookie for 7 days. Sending it back
 * proves the visitor is the author, which allows editing/deleting the message.
 */
@Injectable({
  providedIn: 'root',
})
export class CommentPasswordService {
  private readonly cookiePrefix = 'gb_pw_';

  constructor(private cookieService: CookieService) {}

  /** 32 cryptographically random bytes, encoded in base64url (43 chars). */
  generatePassword(): string {
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    return btoa(String.fromCharCode(...bytes))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  save(commentId: number, password: string): void {
    this.cookieService.set(
      this.cookiePrefix + commentId,
      password,
      COMMENT_RULES.EDIT_WINDOW_DAYS
    );
  }

  get(commentId: number): string | null {
    return this.cookieService.get(this.cookiePrefix + commentId);
  }

  remove(commentId: number): void {
    this.cookieService.delete(this.cookiePrefix + commentId);
  }
}
