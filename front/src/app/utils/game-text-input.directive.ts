import { Directive, ElementRef, OnDestroy, inject } from '@angular/core';
import { MovementService } from '../game/core/movement.service';

/**
 * For a text field displayed over the game: while it has the focus, the typed keys (ZQSD, arrows,
 * space...) go to the field instead of moving the player.
 */
@Directive({
  selector: '[appGameTextInput]',
  host: {
    '(focus)': 'onFocus()',
    '(blur)': 'onBlur()',
  },
})
export class GameTextInputDirective implements OnDestroy {
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly movementService = inject(MovementService);
  private focused = false;

  // Phaser listens to keydown on window: stopping the event in the capture phase hides it from
  // Phaser (which would otherwise preventDefault the space key) without blocking the typing.
  private readonly hideKeyFromGame = (event: KeyboardEvent) => {
    if (document.activeElement === this.element.nativeElement) {
      event.stopImmediatePropagation();
    }
  };

  onFocus() {
    this.focused = true;
    this.movementService.disableMovementKeys();
    window.addEventListener('keydown', this.hideKeyFromGame, true);
  }

  onBlur() {
    if (!this.focused) {
      return;
    }
    this.focused = false;
    this.movementService.enableMovementKeys();
    window.removeEventListener('keydown', this.hideKeyFromGame, true);
  }

  ngOnDestroy() {
    this.onBlur();
  }
}
