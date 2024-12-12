import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ValidAchievementService {
  /**
   * validate an achievement when enter a house or doing an action
   * @param elementId - id of the div in the menu
   *
   */
  ValidAchievement(elementId: string) {
    //when enter a place, valid the achievement in the menu
    const menuAchievement = document.getElementById(elementId);
    if (menuAchievement) {
      menuAchievement.classList.add('done');
    } else {
      console.error(`Element with ID ${elementId} not found.`);
    }
  }
}
