export interface PlayerPositionDTO {
    pseudo: string;
    x: number;
    y: number;
    scene: string;
    uuid: string;
}

export interface TopPlayersDTO {
  players: PlayerPositionDTO[];
  /** Pseudo of the local player refused by the server (forbidden), null when accepted. */
  rejectedPseudo?: string | null;
}
