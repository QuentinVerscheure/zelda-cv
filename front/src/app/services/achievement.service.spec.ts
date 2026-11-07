import { TestBed } from '@angular/core/testing';
import { Achievement } from '../models/achievement.model';
import { AchievementService } from './achievement.service';
import { AchievementStorageService } from './achievement-storage.service';
import { CookieService } from './cookie.service';

describe('Achievements (stored in a cookie)', () => {
  let achievements: AchievementService;
  let storage: AchievementStorageService;
  let cookies: CookieService;

  beforeEach(() => {
    TestBed.inject(CookieService).delete('achievements');
    TestBed.resetTestingModule();
    achievements = TestBed.inject(AchievementService);
    storage = TestBed.inject(AchievementStorageService);
    cookies = TestBed.inject(CookieService);
  });

  it('initialises every achievement to false, only once', () => {
    achievements.singletonInitializeAchievements();
    const initial = storage.getAchievements()!;
    expect(Object.values(initial).every((value) => value === false)).toBe(true);

    storage.updateAchievement('cv', true);
    achievements.singletonInitializeAchievements();
    expect(storage.getAchievements()!.cv).toBe(true);
  });

  it('merging never loses an achievement already unlocked', () => {
    achievements.singletonInitializeAchievements();
    storage.updateAchievement('portfolio', true);

    const merged = achievements.mergeAchievementsAndSave(
      { cv: true } as Achievement,
      { portfolio: false, link: true } as Achievement
    );

    expect(merged.cv).toBe(true);
    expect(merged.link).toBe(true);
    expect(merged.portfolio).toBe(true);
  });

  it('saves the achievements in the cookie so they survive a reload', () => {
    storage.updateAchievement('guestBook', true);
    expect(JSON.parse(cookies.get('achievements')!).guestBook).toBe(true);

    TestBed.resetTestingModule();
    expect(TestBed.inject(AchievementStorageService).getAchievements()!.guestBook).toBe(true);
  });

  it('ignores a corrupted cookie instead of crashing the game', () => {
    cookies.set('achievements', '{not json', 7);
    TestBed.resetTestingModule();
    expect(TestBed.inject(AchievementStorageService).getAchievements()).toBeNull();
  });
});
