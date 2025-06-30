export interface PlayerPositionDTO {
    pseudo: string;
    x: number;
    y: number;
    scene: string;
    uuid: string;
}

export interface TopPlayersDTO {
  players: PlayerPositionDTO[];
}
