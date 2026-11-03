import { Injectable } from '@angular/core';
import { AchievementStorageService } from './achievement-storage.service';
import { Achievement } from '../models/achievement.model';

@Injectable({
  providedIn: 'root',
})
export class AchievementService {
  constructor(private achievementStorageService: AchievementStorageService) {}

  /**
   * Merge one or more achievements with the stored ones,
   * keeping all fields that are true (prioritizing true values).
   * @param achievements Achievement or array of Achievement to merge
   * @returns The merged Achievement object
   */
  mergeAchievementsAndSave(...achievements: Achievement[]): Achievement {
    const stored =
      this.achievementStorageService.getAchievements() || ({} as Achievement);
    const merged: Achievement = { ...stored };

    achievements.forEach((ach) => {
      Object.keys(ach).forEach((key) => {
        const k = key as keyof Achievement;
        if (ach[k]) {
          merged[k] = true;
        }
      });
    });

    this.achievementStorageService.setAchievements(merged);
    return merged;
  }

  singletonInitializeAchievements(): void {
    if (!this.achievementStorageService.getAchievements()) {
      this.achievementStorageService.setAchievements({
        cv: false,
        cvDownload: false,
        portfolio: false,
        link: false,
        linkClick: false,
        phone: false,
        phoneContact: false,
        guestBook: false,
        guestBookComment: false,
        achievementVarious: false,
        achievementCredit: false,
      });
    }
  }
}
