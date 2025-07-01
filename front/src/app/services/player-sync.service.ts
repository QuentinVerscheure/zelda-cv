import { Injectable } from '@angular/core';
import { WebsocketPlayerService } from './websocket-player.service';
import { PlayerService } from '../game/core/player.service';
import { PlayerPositionDTO } from '../models/dto/top-players.dto';
import { Subscription } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class PlayerSyncService {
  // Map of players displayed in the scene for destroy sprite of disconnected players
  private otherPlayers: Map<string, Phaser.Physics.Arcade.Sprite> = new Map();
  private subscription: Subscription | null = null;
  private uuid: string;

  constructor(
    private websocketPlayerService: WebsocketPlayerService,
    private playerService: PlayerService
  ) {
        // generate or retrieve a unique identifier for the user
    // This will be used to identify an unregister and unname player in the WebSocket communication
    const storedUuid = localStorage.getItem('uuid');
    if (storedUuid) {
      this.uuid = storedUuid;
    } else {
      this.uuid = uuidv4();
      localStorage.setItem('uuid', this.uuid);
    }
  }

  /**
   * Call this in each scene after player creation.
   * start the websocket connection and listen to player position updates.
   * subscribe to the topPlayers$ observable to get updates on other players position.
   * @param scene The Phaser.Scene instance
   * @param player The main player sprite
   * @param scaleOfTheGame The scale factor
   * @param sceneName The name of the scene
   */
  syncPlayers(
    scene: Phaser.Scene,
    player: Phaser.Physics.Arcade.Sprite,
    scaleOfTheGame: number,
    sceneName: string
  ) {
    if (this.uuid) {
      this.websocketPlayerService.setPlayerRef(player, sceneName);
      this.websocketPlayerService.connect();
      this.websocketPlayerService.startSending();

      // Unsubscribe previous if any
      if (this.subscription) {
        this.subscription.unsubscribe();
      }

      // Listen to topPlayers$ and update other players
      this.subscription = this.websocketPlayerService.topPlayers$.subscribe(
        (players: PlayerPositionDTO[]) => {
          // Remove sprites for players no longer present base on uuid
          const currentUuid = new Set(players.map((p) => p.uuid));
          for (const [uuid, sprite] of this.otherPlayers.entries()) {
            // If the uuid of the sprite is not in the list of players send by back,
            // it mean player disconnected and we need to destroy the sprite
            if (!currentUuid.has(uuid)) {
              sprite.destroy();
              this.otherPlayers.delete(uuid);
            }
          }
          // Create or update sprites for other players
          for (const playerDTO of players) {
            if (playerDTO.uuid === this.uuid) continue; // Don't show yourself
            const existingSprite = this.otherPlayers.get(playerDTO.uuid);
            // get the old position if the sprite exists for animation
            let oldX: number | undefined = undefined;
            let oldY: number | undefined = undefined;
            if (existingSprite) {
              oldX = existingSprite.x;
              oldY = existingSprite.y;
            }
            const sprite = this.playerService.createOrUpdateOtherPlayer(
              scene,
              scaleOfTheGame,
              playerDTO,
              existingSprite,
              oldX,
              oldY
            );
            this.otherPlayers.set(playerDTO.uuid, sprite);
          }
        }
      );
    }
  }
  /**
   * Call this in scene shutdown/destroy to clean up
   */
  cleanup() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
    for (const sprite of this.otherPlayers.values()) {
      sprite.destroy();
    }
    this.otherPlayers.clear();
  }
}

