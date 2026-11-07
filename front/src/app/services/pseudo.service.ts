import { Injectable, signal } from '@angular/core';
import { COMMENT_RULES } from '../game/scenes/guestBookHouse/comment-rules';

/**
 * Pseudo of the local player, shared by the menu field and the guestbook form: editing one
 * updates the other. It is shown above the player to the other visitors (multiplayer) and is the
 * default author of a new guestbook message. Kept for the browser tab session only.
 */
@Injectable({
  providedIn: 'root',
})
export class PseudoService {
  private static readonly STORAGE_KEY = 'pseudo';

  /** Value as typed (spaces included), so the fields don't fight the user while typing. */
  readonly pseudo = signal(PseudoService.read());

  set(value: string) {
    const pseudo = (value ?? '').slice(0, COMMENT_RULES.PSEUDO_MAX_LENGTH);
    this.pseudo.set(pseudo);
    try {
      sessionStorage.setItem(PseudoService.STORAGE_KEY, pseudo);
    } catch {
      // storage unavailable (privacy settings): the pseudo just lasts until the page is reloaded
    }
  }

  /** Pseudo to send or display: trimmed, empty when not set. */
  current(): string {
    return this.pseudo().trim();
  }

  private static read(): string {
    try {
      return (sessionStorage.getItem(PseudoService.STORAGE_KEY) ?? '').slice(
        0,
        COMMENT_RULES.PSEUDO_MAX_LENGTH
      );
    } catch {
      return '';
    }
  }
}
