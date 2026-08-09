import { Injectable } from '@angular/core';
import * as Phaser from 'phaser';

@Injectable({
  providedIn: 'root',
})
export class MovementService {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
  private keys: {
    Z: Phaser.Input.Keyboard.Key | null;
    Q: Phaser.Input.Keyboard.Key | null;
    S: Phaser.Input.Keyboard.Key | null;
    D: Phaser.Input.Keyboard.Key | null;
  } = { Z: null, Q: null, S: null, D: null };

  private joystick: any;

  //coordinates of mouse click for pointer movement
  private targetX: number | null = null;
  private targetY: number | null = null;
  private mousePointerDown: boolean = false;

  //speed of character movement
  private speed = 80;

  private direction: string = '';
  private isMoving: boolean = false;

  /**
   * Initialize the keyboard input and joystick
   * the game isn't qwerty friendly
   */
  initializeInput(
    scene: Phaser.Scene,
    player: Phaser.Physics.Arcade.Sprite,
    scaleOfTheGame: number
  ) {
    const input = scene.input;
    if (input.keyboard) {
      this.cursors = input.keyboard.createCursorKeys();
    }

    //register pointer events for mouse clic movement
    this.registerPointerAndUpdateEvents(scene, player, scaleOfTheGame);
  }

  /**
   * Create the animation for the players' movements.
   */
  initializeMoveAnimation(anims: Phaser.Animations.AnimationManager) {
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
  movePlayer(
    player: Phaser.Physics.Arcade.Sprite,
    scaleOfTheGame: number,
    scene: Phaser.Scene
  ) {
    // disable the movement if the player is editing a comment
    if (scene && (scene as any).isEditingComment) {
      player.setVelocity(0, 0);
      player.stop();
      return;
    }

    // Keyboard input
    if (!this.mousePointerDown) {
      
      if (this.cursors?.up.isDown) {
        player.setVelocityY(-this.speed * scaleOfTheGame);
        this.isMoving = true;
        this.direction = 'top';
      } else if (this.cursors?.down.isDown) {
        player.setVelocityY(this.speed * scaleOfTheGame);
        this.isMoving = true;
        this.direction = 'down';
      } else {
        player.setVelocityY(0);
        this.isMoving = false;
      }
      if (this.cursors?.left.isDown) {
        player.setVelocityX(-this.speed * scaleOfTheGame);
        this.isMoving = true;
        this.direction = 'left';
      } else if (this.cursors?.right.isDown) {
        player.setVelocityX(this.speed * scaleOfTheGame);
        this.isMoving = true;
        this.direction = 'right';
      } else {
        player.setVelocityX(0);
      }

    }

    // Dissociate move and animation for the diagonal case and because animation need to start
    // once and not at every frame
    if (this.isMoving && this.direction === 'left') {
      player.play('walkingLeft', true);
    } else if (this.isMoving && this.direction === 'right') {
      player.play('walkingRight', true);
    } else if (this.isMoving && this.direction === 'top') {
      player.play('walkingTop', true);
    } else if (this.isMoving && this.direction === 'down') {
      player.play('walkingDown', true);
    }

    // Set a specific frame when the player stops moving
    if (!this.isMoving) {
      player.stop(); // Stop the animation
      switch (this.direction) {
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

  registerPointerAndUpdateEvents(
    scene: Phaser.Scene,
    player: Phaser.Physics.Arcade.Sprite,
    scaleOfTheGame: number
  ) {
    scene.input.on('pointerdown', () => {
      this.mousePointerDown = true;
      this.isMoving = true;
    });

    scene.input.on('pointerup', () => {
      this.mousePointerDown = false;
      this.isMoving = false;
      this.targetX = null;
      this.targetY = null;
      if (player.body) player.setVelocity(0, 0);
    });

    scene.events.on('update', () => {
      if (this.mousePointerDown && scene.input.activePointer.isDown) {
        const pointer = scene.input.activePointer;
        const worldPoint = scene.cameras.main.getWorldPoint(pointer.x, pointer.y);
        this.targetX = worldPoint.x;
        this.targetY = worldPoint.y;
      }

      if (
        this.targetX !== null &&
        this.targetY !== null &&
        scene.input.activePointer.isDown
      ) {
        const dx = this.targetX - player.x;
        const dy = this.targetY - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 2) {
          const angle = Math.atan2(dy, dx);
          const vx = Math.cos(angle) * this.speed * scaleOfTheGame;
          const vy = Math.sin(angle) * this.speed * scaleOfTheGame;
          if (player.body) player.setVelocity(vx, vy);
          this.isMoving = true;

          // Animation logic for pointer movement
          if (player.anims) {
            if (vy < 0 && Math.abs(vy) > Math.abs(vx)) {
              this.direction = 'top';
              player.play('walkingTop', true);
            } else if (vx > 0 && Math.abs(vx) > Math.abs(vy)) {
              this.direction = 'right';
              player.play('walkingRight', true);
            } else if (vy > 0 && Math.abs(vy) > Math.abs(vx)) {
              this.direction = 'down';
              player.play('walkingDown', true);
            } else {
              this.direction = 'left';
              player.play('walkingLeft', true);
            }
          }
        } else {
          // Arrived at the target: stop cleanly instead of jittering
          // around it with stale velocity from the previous frame.
          if (player.body) player.setVelocity(0, 0);
          this.isMoving = false;
        }
      }
    });
  }

  /**
   * Move and animate another player (from WebSocket)
   */
  moveOtherPlayer(
    sprite: Phaser.Physics.Arcade.Sprite,
    playerDTO: { x: number; y: number },
    oldX?: number,
    oldY?: number,
    scene?: Phaser.Scene
  ) {
    // Animation direction based on position change
    if (oldX !== undefined && oldY !== undefined) {
      const dx = playerDTO.x - oldX;
      const dy = playerDTO.y - oldY;
      if (dx === 0 && dy === 0) {
        // Immobile : stop animation
        sprite.stop();
      } else if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) sprite.play('walkingRight', true);
        else if (dx < 0) sprite.play('walkingLeft', true);
      } else if (Math.abs(dy) > 0) {
        if (dy > 0) sprite.play('walkingDown', true);
        else if (dy < 0) sprite.play('walkingTop', true);
      }
    }
    // Smoothly move the sprite to the new position
    if (scene && (sprite.x !== playerDTO.x || sprite.y !== playerDTO.y)) {
      scene.tweens.add({
        targets: sprite,
        x: playerDTO.x,
        y: playerDTO.y,
        duration: 180, // slightly less than the send interval (200ms)
        ease: 'Linear',
      });
    }
  }

  disableMovementKeys() {
    if (this.keys) {
      Object.values(this.keys).forEach((key) => key?.reset());
      Object.values(this.keys).forEach((key) => key && (key.enabled = false));
    }
    if (this.cursors) {
      Object.values(this.cursors).forEach(
        (key) => key && (key.enabled = false)
      );
    }
  }

  enableMovementKeys() {
    if (this.keys) {
      Object.values(this.keys).forEach((key) => key && (key.enabled = true));
    }
    if (this.cursors) {
      Object.values(this.cursors).forEach((key) => key && (key.enabled = true));
    }
  }
}
