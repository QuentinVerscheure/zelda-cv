import { Injectable } from '@angular/core';
import { MovementService } from './movement.service';

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
}
