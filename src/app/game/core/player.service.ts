import { Injectable } from '@angular/core';
import { MovementService } from './movement.service';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  constructor(private movementService: MovementService,) {}

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

    scene.cameras.main.startFollow(player);

    // Initialize players animation
    this.movementService.initializeMoveAnimation(scene.anims);

    return player
  }
}
