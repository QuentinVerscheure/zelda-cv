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
      sprite.setDepth(9);
      this.movementService.initializeMoveAnimation(scene.anims);

      // Destroy label if sprite is destroyed
      const origDestroy = sprite.destroy.bind(sprite);
      sprite.destroy = function (...args: any[]) {
        if ((sprite as any).pseudoLabel) {
          (sprite as any).pseudoLabel.destroy();
          (sprite as any).pseudoLabel = undefined;
        }
        return origDestroy(...args);
      };
    } else {
      this.movementService.moveOtherPlayer(sprite, playerDTO, oldX, oldY, scene);
    }

    // display the pseudo above the sprite if it exists
    if (playerDTO.pseudo && playerDTO.pseudo.trim() !== '') {
      let labelContainer = (sprite as any).pseudoLabel as Phaser.GameObjects.Container | undefined;
      let pseudoText: Phaser.GameObjects.Text | undefined;

      let shouldRecreate = false;
      if (labelContainer) {
        pseudoText = labelContainer.list.find(obj => obj instanceof Phaser.GameObjects.Text) as Phaser.GameObjects.Text;
        if (!pseudoText || pseudoText.text !== playerDTO.pseudo) {
          // Pseudo changed, destroy old label
          labelContainer.destroy();
          (sprite as any).pseudoLabel = undefined;
          shouldRecreate = true;
        }
      } else {
        shouldRecreate = true;
      }

      if (shouldRecreate) {
        // Create a container for the label
        labelContainer = scene.add.container();
        const tempText = scene.add.text(0, 0, playerDTO.pseudo, {
          fontFamily: 'Pixelify_Sans',
          fontSize: `${4 * scaleOfTheGame}px`,
        });
        const textWidth = tempText.width;
        tempText.destroy();
        const padding = 4 * scaleOfTheGame;
        const bgWidth = textWidth + padding * 2;
        const bgHeight = 6 * scaleOfTheGame;

        const bg = scene.add.rectangle(
          0,
          0,
          bgWidth,
          bgHeight,
          0x000000,
          0.5
        );
        bg.setOrigin(0.5, -0.50);

        pseudoText = scene.add.text(0, 0, playerDTO.pseudo, {
          fontFamily: 'Pixelify_Sans',
          fontSize: `${4 * scaleOfTheGame}px`,
          color: '#ffffff',
          align: 'center',
        });
        pseudoText.setOrigin(0.5, -0.80);

        labelContainer.add(bg);
        labelContainer.add(pseudoText);
        labelContainer.setDepth(20);
        labelContainer.x = playerDTO.x;
        labelContainer.y = playerDTO.y - 18 * scaleOfTheGame;
        scene.events.on('update', () => {
          labelContainer!.x = sprite.x;
          labelContainer!.y = sprite.y - 18 * scaleOfTheGame;
        });
        (sprite as any).pseudoLabel = labelContainer;
      }
    } else if ((sprite as any).pseudoLabel) {
      (sprite as any).pseudoLabel.destroy();
      (sprite as any).pseudoLabel = undefined;
    }

    return sprite;
  }
}
