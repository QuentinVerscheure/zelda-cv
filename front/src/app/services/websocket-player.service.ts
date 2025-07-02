import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import { PlayerPositionDTO, TopPlayersDTO } from '../models/dto/top-players.dto';
import { escapeString } from '../utils/sanitize-string.util';
import { v4 as uuidv4 } from 'uuid';
import { ScaleOfTheGameService } from '../game/core/scale-of-the-game.service';

@Injectable({
  providedIn: 'root',
})
export class WebsocketPlayerService implements OnDestroy {
  private ws: WebSocket | null = null;
  private sendIntervalSub: Subscription | null = null;
  private readonly WS_URL =
    window.location.protocol === 'https:'
      ? `wss://${window.location.hostname}/ws/positions`
      : `ws://${window.location.hostname}/ws/positions`;

  private myPosition: PlayerPositionDTO | null = null;
  public topPlayers$ = new BehaviorSubject<PlayerPositionDTO[]>([]);

  private isConnected = false;
  private isSending = false;

  // Reference to the Phaser player sprite
  private playerRef: Phaser.Physics.Arcade.Sprite | null = null;
  private currentScene: string = '';

  private scaleOfTheGame: number = ScaleOfTheGameService.getScaleOfTheGame();

  // add a unique identifier for the user
  // This will be used to identify an unregister and unname player in the WebSocket communication
  private uuid: string;

  constructor(private ngZone: NgZone) {
            // generate or retrieve a unique identifier for the user
    // This will be used to identify an unregister and unname player in the WebSocket communication
    const storedUuid = sessionStorage.getItem('uuid');
    if (storedUuid && storedUuid !== '') {
      this.uuid = storedUuid;
    } else {
      this.uuid = uuidv4();
      sessionStorage.setItem('uuid', this.uuid);
    }
  }

  /**
   * Escape dangerous characters in all string fields of PlayerPositionDTO[]
   * string from back come front other users's front and should be sanitized
   * phaser don't have native XSS protection, so we need to sanitize manually
   * @param players - Array of PlayerPositionDTO to sanitize
   * @return Sanitized array of PlayerPositionDTO
   */
  private sanitizePlayers(players: PlayerPositionDTO[]): PlayerPositionDTO[] {
    return players.map(player => ({
      ...player,
      pseudo: escapeString(player.pseudo),
      scene: escapeString(player.scene),
      uuid: escapeString(player.uuid)
    }));
  }

  connect() {
    if (this.isConnected) return;
    this.isConnected = true;
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }
    this.ws = new WebSocket(this.WS_URL);

    this.ws.onmessage = (event) => {
      try {
        const data: TopPlayersDTO = JSON.parse(event.data);
        const sanitizedPlayers = this.sanitizePlayers(data.players);
        // Corrige les coordonnées avec scaleOfTheGame
        const scaledPlayers = sanitizedPlayers.map(player => ({
          ...player,
          x: player.x * this.scaleOfTheGame,
          y: player.y * this.scaleOfTheGame
        }));
        this.ngZone.run(() => {
          this.topPlayers$.next(scaledPlayers);
        });
      } catch {
        // Si erreur, affiche la donnée brute
        console.error('Error parsing WebSocket message:', event.data);
      }
    };

    this.ws.onclose = () => {
      this.stopSending();
      this.isConnected = false;
      setTimeout(() => this.connect(), 1000); // auto-reconnect
    };
  }

  // Sets the player reference and initializes the position if not already set
  setPlayerRef(player: Phaser.Physics.Arcade.Sprite, sceneName: string) {
    this.playerRef = player;
    this.currentScene = sceneName;
    if (!this.myPosition) {
      this.myPosition = {
        pseudo: sessionStorage.getItem('pseudo') || '',
        x: player.x,
        y: player.y,
        scene: sceneName,
        uuid: this.uuid
      };
    }
  }

  startSending() {
    if (this.isSending) return;
    this.isSending = true;
    if (this.sendIntervalSub) return;
    this.sendIntervalSub = interval(200).subscribe(() => {
      // Update position just before sending
      if (this.ws && this.ws.readyState === WebSocket.OPEN && this.playerRef && this.myPosition) {
        // /this.scaleOfTheGame because the position in player object is scale with a diff desktop/smartphone scaleOfTheGame.
        this.myPosition.x = this.playerRef.x / this.scaleOfTheGame;
        this.myPosition.y = this.playerRef.y / this.scaleOfTheGame;
        this.myPosition.pseudo = sessionStorage.getItem('pseudo') || '';
        this.myPosition.scene = this.currentScene;
        this.myPosition.uuid = this.uuid;
        this.ws.send(JSON.stringify(this.myPosition));
      }
    });
  }

  stopSending() {
    this.isSending = false;
    if (this.sendIntervalSub) {
      this.sendIntervalSub.unsubscribe();
      this.sendIntervalSub = null;
    }
  }

  disconnect() {
    this.stopSending();
    this.isConnected = false;
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  setMyPosition(position: PlayerPositionDTO) {
    this.myPosition = position;
  }

  ngOnDestroy() {
    this.disconnect();
  }
}
