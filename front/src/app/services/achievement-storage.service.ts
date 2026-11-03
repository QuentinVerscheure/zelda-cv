import { Injectable } from '@angular/core';
import { Achievement } from '../models/achievement.model';
import { BehaviorSubject } from 'rxjs';
import { CookieService } from './cookie.service';

/**
 * Stores the visitor's achievements in a cookie (no backend storage).
 * Each update extends the cookie lifetime; losing them is not a problem.
 */
@Injectable({
  providedIn: 'root'
})
export class AchievementStorageService {
  private readonly achievementsKey = 'achievements';
  private readonly cookieLifetimeDays = 7;

  // BehaviorSubject for reactive updates
  public achievements$: BehaviorSubject<Achievement | null>;

  constructor(private cookieService: CookieService) {
    this.achievements$ = new BehaviorSubject<Achievement | null>(this.readCookie());
  }

  setAchievements(achievements: Achievement): void {
    this.cookieService.set(
      this.achievementsKey,
      JSON.stringify(achievements),
      this.cookieLifetimeDays
    );
    this.achievements$.next(achievements);
  }

  getAchievements(): Achievement | null {
    return this.achievements$.value;
  }

  updateAchievement<K extends keyof Achievement>(field: K, value: Achievement[K]): void {
    const achievements = this.getAchievements() || {} as Achievement;
    achievements[field] = value;
    this.setAchievements(achievements);
  }

  clearAchievements(): void {
    this.cookieService.delete(this.achievementsKey);
    this.achievements$.next(null);
  }

  private readCookie(): Achievement | null {
    const data = this.cookieService.get(this.achievementsKey);
    if (!data) {
      return null;
    }
    try {
      return JSON.parse(data) as Achievement;
    } catch {
      return null;
    }
  }
}
