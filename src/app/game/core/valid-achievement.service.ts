import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ValidAchievementService {
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
