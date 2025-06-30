import { Injectable } from '@angular/core';
import { MovementService } from './movement.service';
import { PlayerPositionDTO } from '../../models/dto/top-players.dto';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  constructor(private movementService: MovementService) {}

  /**
   *  create the player object
   * @param player - an empty player object
   * @param initialPlayerX - Coordinate of the initial position of the player in the scene
   * @param fisrtSprite - first sprite of the player (for exemple if the player come from a door in the left, the first sprite should look right)
   *
   */
  createPlayer(
    player: Phaser.Physics.Arcade.Sprite,
    scene: Phaser.Scene,
    scaleOfTheGame: number,
    initialPlayerX: number,
    initialPlayerY: number,
    fisrtSprite: string
  ) {
    player = scene.physics.add.sprite(
      initialPlayerX,
      initialPlayerY,
      'linkDefault',
      fisrtSprite
    );
    player.setScale(scaleOfTheGame);
    player.setSize(10, 10); //Dimensions of hitbox
    player.setOffset(5, 9); //offset of the hitbox
    player.setDepth(10); //set depth so the player walk infront of the text insteed of behind

    scene.cameras.main.startFollow(player);

    // Initialize players animation
    this.movementService.initializeMoveAnimation(scene.anims);

    return player;
  }

  /**
   * Create or update a sprite for another user (received from WebSocket)
   * @param scene - The current Phaser scene
   * @param scaleOfTheGame - scale of the game
   * @param playerDTO - PlayerPositionDTO received from WebSocket
   * @param existingSprite - (optional) existing sprite to update, otherwise a new one is created
   * @param oldX - (optional) previous X position
   * @param oldY - (optional) previous Y position
   * @returns The sprite representing the other user
   */
  createOrUpdateOtherPlayer(
    scene: Phaser.Scene,
    scaleOfTheGame: number,
    playerDTO: PlayerPositionDTO,
    existingSprite?: Phaser.Physics.Arcade.Sprite,
    oldX?: number,
    oldY?: number
  ): Phaser.Physics.Arcade.Sprite {
    let sprite = existingSprite;
    if (!sprite) {
      sprite = scene.physics.add.sprite(
        playerDTO.x,
        playerDTO.y,
        'linkDefault',
        'walkingTop/frame0001'
      );
      sprite.setScale(scaleOfTheGame);
      sprite.setSize(10, 10);
      sprite.setOffset(5, 9);
      sprite.setDepth(9); // Slightly behind the main player
      this.movementService.initializeMoveAnimation(scene.anims);
    } else {
      // Animation direction based on position change
      if (oldX !== undefined && oldY !== undefined) {
        const dx = playerDTO.x - oldX;
        const dy = playerDTO.y - oldY;
        if (Math.abs(dx) > Math.abs(dy)) {
          if (dx > 0) sprite.play('walkingRight', true);
          else if (dx < 0) sprite.play('walkingLeft', true);
        } else if (Math.abs(dy) > 0) {
          if (dy > 0) sprite.play('walkingDown', true);
          else if (dy < 0) sprite.play('walkingTop', true);
        }
      }
      // smoothly move the sprite to the new position
      // animation tween is an animation that smoothly moves the sprite between two points
      if (sprite.x !== playerDTO.x || sprite.y !== playerDTO.y) {
        scene.tweens.add({
          targets: sprite,
          x: playerDTO.x,
          y: playerDTO.y,
          duration: 180, // slightly less than the send interval (200ms)
          ease: 'Linear',
        });
      }
    }
    return sprite;
  }
}
