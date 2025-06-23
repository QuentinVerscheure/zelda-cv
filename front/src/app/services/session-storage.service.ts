import { Injectable } from '@angular/core';
import { Achievement } from '../models/achievement.model';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {
  private readonly achievementsKey = 'achievements';

  // BehaviorSubject for reactive updates
  public achievements$ = new BehaviorSubject<Achievement | null>(this.getSessionStorageAchievements());

  constructor(private apiService: ApiService) {}

  setAchievements(achievements: Achievement): void {
    sessionStorage.setItem(this.achievementsKey, JSON.stringify(achievements));
    this.achievements$.next(achievements);
  }

  getAchievements(): Achievement | null {
    return this.achievements$.value;
  }

  getSessionStorageAchievements(): Achievement | null {
    const data = sessionStorage.getItem(this.achievementsKey);
    return data ? JSON.parse(data) as Achievement : null;
  }

  updateAchievement<K extends keyof Achievement>(field: K, value: Achievement[K]): void {
    const achievements = this.getAchievements() || {} as Achievement;
    achievements[field] = value;
    this.setAchievements(achievements);
  }

  clearAchievements(): void {
    sessionStorage.removeItem(this.achievementsKey);
    this.achievements$.next(null);
  }

  /**
   * Syncs the pseudo from the current user token with session storage.
   * usefull when the user comeback, token is still available (localStorage) but not the 
   * pseudo (sessionStorage).
   */
  syncPseudoWithToken() {
    const token = localStorage.getItem('accessToken');
    const pseudo = sessionStorage.getItem('pseudo');
    if (token && !pseudo) {
      this.apiService.getCurrentUser().subscribe(user => {
        if (user && user.pseudo) {
          sessionStorage.setItem('pseudo', user.pseudo);
          console.log('Pseudo synced with token:', user.pseudo);
        }
      });
    }
  }
}

