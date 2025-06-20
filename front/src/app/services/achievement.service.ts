import { Injectable } from '@angular/core';
import { SessionStorageService } from './session-storage.service';
import { ApiService } from './api.service';
import { Achievement } from '../models/achievement.model';
import { Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AchievementService {
  constructor(
    private sessionStorageService: SessionStorageService,
    private apiService: ApiService
  ) {}

  /**
   * Merge one or more achievements with the one in session storage,
   * keeping all fields that are true (prioritizing true values).
   * @param achievements Achievement or array of Achievement to merge
   * @returns The merged Achievement object
   */
  mergeAchievementsAndSave(...achievements: Achievement[]): Achievement {
    const stored =
      this.sessionStorageService.getAchievements() || ({} as Achievement);
    const merged: Achievement = { ...stored };

    achievements.forEach((ach) => {
      Object.keys(ach).forEach((key) => {
        const k = key as keyof Achievement;
        if (ach[k]) {
          merged[k] = true;
        }
      });
    });

    this.sessionStorageService.setAchievements(merged);

    //save in DB if user is authenticated
    if (localStorage.getItem('accessToken')) {
      this.apiService.updateAchievement(merged).subscribe();
    }
    return merged;
  }

  singletonInitializeAchievements(): void {
    let achievements = this.sessionStorageService.getAchievements();
    if (!achievements || achievements === null) {
      if (localStorage.getItem('accessToken')) {
        // If user is authenticated, fetch achievements from the backend
        this.apiService
          .getUserAchievement()
          .pipe(
            switchMap((achievements: Achievement) => {
              this.sessionStorageService.setAchievements(achievements);
              return of(achievements);
            })
          )
          .subscribe();
      } else {
        // Initialize with default values
        achievements = {
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
        };
        this.sessionStorageService.setAchievements(achievements);
      }
    }
  }
}
