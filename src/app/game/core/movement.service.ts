import { Injectable } from '@angular/core';
import * as Phaser from 'phaser';

@Injectable({
  providedIn: 'root'
})
export class MovementService {
  private static cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
  private static keys: {
    Z: Phaser.Input.Keyboard.Key | null;
    Q: Phaser.Input.Keyboard.Key | null;
    S: Phaser.Input.Keyboard.Key | null;
    D: Phaser.Input.Keyboard.Key | null;
  } = { Z: null, Q: null, S: null, D: null };

  /**
   * Initialize the keyboard input
   */
  static initializeKeyboardInput(input: Phaser.Input.InputPlugin) {
    if (input.keyboard) {
      MovementService.cursors = input.keyboard.createCursorKeys();
      // Mobility input
      MovementService.keys = input.keyboard.addKeys('Z,Q,S,D') as {
        Z: Phaser.Input.Keyboard.Key;
        Q: Phaser.Input.Keyboard.Key;
        S: Phaser.Input.Keyboard.Key;
        D: Phaser.Input.Keyboard.Key;
      };
    }
  }

  /**
   * Create the animation for the moves of the players
   */
  static initializeMoveAnimation(anims: Phaser.Animations.AnimationManager) {
    const animations = [
      { key: 'walkingRight', prefix: 'walkingRight/frame' },
      { key: 'walkingLeft', prefix: 'walkingLeft/frame' },
      { key: 'walkingTop', prefix: 'walkingTop/frame' },
      { key: 'walkingDown', prefix: 'walkingDown/frame' },
    ];

    animations.forEach((anim) => {
      if (!anims.exists(anim.key)) {
        anims.create({
          key: anim.key,
          frames: anims.generateFrameNames('linkDefault', {
            prefix: anim.prefix,
            start: 1,
            end: 2,
            zeroPad: 4,
          }),
          frameRate: 4,
          repeat: -1,
        });
      }
    });
  }

  /**
   * Do the action associate to a specific input
   */
  static movePlayer(
    player: Phaser.Physics.Arcade.Sprite, scaleOfTheGame: number
  ) {
    let isMoving = false; // Use for stopping the animation after the release of the key
    let direction = ''; // Use for choosing the frame of the static player asset

    if (MovementService.cursors?.left.isDown || MovementService.keys.Q?.isDown) {
      player.setVelocityX(-80 * scaleOfTheGame);
      isMoving = true;
      direction = 'left';
    } else if (MovementService.cursors?.right.isDown || MovementService.keys.D?.isDown) {
      player.setVelocityX(80 * scaleOfTheGame);
      isMoving = true;
      direction = 'right';
    } else {
      player.setVelocityX(0);
    }

    if (MovementService.cursors?.up.isDown || MovementService.keys.Z?.isDown) {
      player.setVelocityY(-80 * scaleOfTheGame);
      isMoving = true;
      direction = 'top';
    } else if (MovementService.cursors?.down.isDown || MovementService.keys.S?.isDown) {
      player.setVelocityY(80 * scaleOfTheGame);
      isMoving = true;
      direction = 'down';
    } else {
      player.setVelocityY(0);
    }

    // Dissociate move and animation for the diagonal case
    if (MovementService.cursors?.left.isDown || MovementService.keys.Q?.isDown) {
      player.play('walkingLeft', true);
    } else if (MovementService.cursors?.right.isDown || MovementService.keys.D?.isDown) {
      player.play('walkingRight', true);
    } else if (MovementService.cursors?.up.isDown || MovementService.keys.Z?.isDown) {
      player.play('walkingTop', true);
    } else if (MovementService.cursors?.down.isDown || MovementService.keys.S?.isDown) {
      player.play('walkingDown', true);
    }

    // Set a specific frame when the player stops moving
    if (!isMoving) {
      player.stop(); // Stop the animation
      switch (direction) {
        case 'right':
          player.setFrame('walkingRight/frame0001');
          break;
        case 'left':
          player.setFrame('walkingLeft/frame0001');
          break;
        case 'top':
          player.setFrame('walkingTop/frame0001');
          break;
        case 'down':
          player.setFrame('walkingDown/frame0001');
          break;
        default:
          break;
      }
    }
  }
}