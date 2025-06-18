import { Injectable } from '@angular/core';
import { SessionStorageService } from './session-storage.service';
import { ApiService } from './api.service';
import { Achievement } from '../models/achievement.model';
import { Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AchievementService {
  constructor(
    private sessionStorageService: SessionStorageService,
    private apiService: ApiService
  ) {}

  updateAchievementField<K extends keyof Achievement>(field: K, value: Achievement[K]): Observable<Achievement> {
    const updatedAchievement = this.sessionStorageService.getAchievements();
    if (updatedAchievement) {
      this.sessionStorageService.updateAchievementField(field, value);
    } else {
      return this.apiService.getUserAchievement().pipe(
        switchMap((achievement) => {
          this.sessionStorageService.setAchievements(achievement);
          this.sessionStorageService.updateAchievementField(field, value);
          const refreshed = this.sessionStorageService.getAchievements();
          return this.apiService.updateAchievement(refreshed!);
        })
      );
    }

    const refreshed = this.sessionStorageService.getAchievements();
      return this.apiService.updateAchievement(refreshed!);
    });
  }

}
