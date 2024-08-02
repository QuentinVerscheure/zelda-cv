import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScaleOfTheGameService {

  static scaleOfTheGame: number = ScaleOfTheGameService.calculatescaleOfTheGame();

static getScaleOfTheGame(){
  return this.scaleOfTheGame
}

static calculatescaleOfTheGame(){
  const width = window.innerWidth;
  let scaleOfTheGame:number;

  // Set scaleOfTheGame based on screen width
  if (width >= 1024) {
    scaleOfTheGame = 4; // Desktop
  } else if (width >= 768) {
    scaleOfTheGame = 3; // Tablets
  } else {
    scaleOfTheGame = 2; // Smartphones
  }

  return scaleOfTheGame;
}

}
