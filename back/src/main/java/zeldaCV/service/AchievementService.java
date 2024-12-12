package zeldaCV.service;

import zeldaCV.bean.AchievementBean;

import java.util.List;

public interface AchievementService {
    List<AchievementBean> getAllAchievements();
    AchievementBean getAchievementByUserId(Long userId);
    AchievementBean updateAchievement(AchievementBean achievementBean);
}
