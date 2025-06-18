import { Injectable } from '@angular/core';
import { Achievement } from '../models/achievement.model';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {
  private readonly key = 'achievements';

  setAchievements(achievements: Achievement): void {
    sessionStorage.setItem(this.key, JSON.stringify(achievements));
  }

  getAchievements(): Achievement | null {
    const data = sessionStorage.getItem(this.key);
    return data ? JSON.parse(data) as Achievement : null;
  }

  updateAchievementField<K extends keyof Achievement>(field: K, value: Achievement[K]): void {
    const achievements = this.getAchievements() || {} as Achievement;
    achievements[field] = value;
    this.setAchievements(achievements);
  }

  clearAchievements(): void {
    sessionStorage.removeItem(this.key);
  }
}
