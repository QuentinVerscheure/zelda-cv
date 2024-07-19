import { Injectable } from '@angular/core';
import * as Phaser from 'phaser';

@Injectable({
  providedIn: 'root',
})
export class MovementService {
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  keys!: {
    Z: Phaser.Input.Keyboard.Key;
    Q: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
  };

  /**
   * initialize the input
   */
  initializeKeyboardInput(input: Phaser.Input.InputPlugin) {
    if (input.keyboard) {
      this.cursors = input.keyboard.createCursorKeys();
      //mobility inpout
      this.keys = input.keyboard.addKeys('Z,Q,S,D') as {
        Z: Phaser.Input.Keyboard.Key;
        Q: Phaser.Input.Keyboard.Key;
        S: Phaser.Input.Keyboard.Key;
        D: Phaser.Input.Keyboard.Key;
      };
    }
  }

  /**
   * create the animation for the moves of the players
   */
  initializeMoveAnimation(anims: Phaser.Animations.AnimationManager) {
    const animations = [
      { key: 'walkingRight', prefix: 'walkingRight/frame' },
      { key: 'walkingLeft', prefix: 'walkingLeft/frame' },
      { key: 'walkingTop', prefix: 'walkingTop/frame' },
      { key: 'walkingDown', prefix: 'walkingDown/frame' },
    ];

    animations.forEach((anim) => {
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
    });
  }

  /**
   * do the action associate to a spécific input
   */
  movePlayer(
    camera: Phaser.Cameras.Scene2D.Camera,
    player: Phaser.GameObjects.Sprite
  ) {
    const speed = 1.4; // Speed of background movement when player moves, the player stay in the middle of the screen

    let isMoving = false; //use for stopping the animation after the release of the key
    let direction = ''; //use for chosing the frame of the statit player asset

    if (this.cursors.left.isDown || this.keys.Q.isDown) {
      player.x -= speed;
      isMoving = true;
      direction = 'left';
    } else if (this.cursors.right.isDown || this.keys.D.isDown) {
      player.x += speed;
      isMoving = true;
      direction = 'right';
    }
    if (this.cursors.up.isDown || this.keys.Z.isDown) {
      player.y -= speed;
      isMoving = true;
      direction = 'top';
    } else if (this.cursors.down.isDown || this.keys.S.isDown) {
      player.y += speed;
      isMoving = true;
      direction = 'down';
    }

    //disciociate move and animation for the diagonale case
    if (this.cursors.left.isDown || this.keys.Q.isDown) {
      player.play('walkingLeft', true);
    } else if (this.cursors.right.isDown || this.keys.D.isDown) {
      player.play('walkingRight', true);
    } else if (this.cursors.up.isDown || this.keys.Z.isDown) {
      player.play('walkingTop', true);
    } else if (this.cursors.down.isDown || this.keys.S.isDown) {
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
