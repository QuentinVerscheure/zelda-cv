import { Injectable } from '@angular/core';
import { MovementService } from './movement.service';
import { PlayerPositionDTO } from '../../models/dto/top-players.dto';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private static readonly WORLD_SCENE_KEY = 'sceneWorld';

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

    this.updatePseudoLabel(scene, sprite, playerDTO.pseudo?.trim() ?? '', scaleOfTheGame);

    return sprite;
  }

  /**
   * Display the pseudo above another player's sprite (nothing when the pseudo is empty).
   * The label is created once and its text updated in place: the pseudo can change on every
   * keystroke of the menu field.
   */
  private updatePseudoLabel(
    scene: Phaser.Scene,
    sprite: Phaser.Physics.Arcade.Sprite,
    pseudo: string,
    scaleOfTheGame: number
  ) {
    let label = (sprite as any).pseudoLabel as Phaser.GameObjects.Container | undefined;

    if (pseudo === '') {
      label?.destroy();
      (sprite as any).pseudoLabel = undefined;
      return;
    }

    // the world map is much bigger than the houses: the label is twice as big to stay readable
    const size = scaleOfTheGame * (scene.scene.key === PlayerService.WORLD_SCENE_KEY ? 2 : 1);
    const padding = 4 * size;
    const height = 6 * size;
    // bottom of the label, just above the head of the sprite
    const offsetY = 9 * scaleOfTheGame;

    if (!label) {
      const background = scene.add.rectangle(0, 0, 0, height, 0x000000, 0.5).setOrigin(0.5, 1);
      const text = scene.add
        .text(0, -height / 2, '', {
          fontFamily: 'Pixelify_Sans',
          fontSize: `${4 * size}px`,
          color: '#ffffff',
          align: 'center',
        })
        .setOrigin(0.5, 0.5);

      const newLabel = scene.add.container(sprite.x, sprite.y - offsetY, [background, text]);
      newLabel.setDepth(20);
      const follow = () => newLabel.setPosition(sprite.x, sprite.y - offsetY);
      scene.events.on('update', follow);
      newLabel.once('destroy', () => scene.events.off('update', follow));

      label = newLabel;
      (sprite as any).pseudoLabel = label;
    }

    const [background, text] = label.list as [
      Phaser.GameObjects.Rectangle,
      Phaser.GameObjects.Text,
    ];
    if (text.text !== pseudo) {
      text.setText(pseudo);
      background.setSize(text.width + padding * 2, height);
    }
  }
}
