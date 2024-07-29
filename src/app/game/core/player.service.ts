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
    player.setDepth(10);//set depth so the player walk infront of the text insteed of behind

    scene.cameras.main.startFollow(player);

    // Initialize players animation
    this.movementService.initializeMoveAnimation(scene.anims);

    return player
  }
}
