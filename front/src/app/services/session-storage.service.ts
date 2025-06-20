import { Injectable } from '@angular/core';
import { Achievement } from '../models/achievement.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {
  private readonly achievementsKey = 'achievements';

  // BehaviorSubject for reactive updates
  public achievements$ = new BehaviorSubject<Achievement | null>(this.getSessionStorageAchievements());

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
}

