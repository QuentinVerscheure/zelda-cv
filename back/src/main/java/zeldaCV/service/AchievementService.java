package zeldaCV.service;

import zeldaCV.bean.AchievementBean;
import zeldaCV.dto.AchievementDTO;


public interface AchievementService {
    AchievementDTO getAchievementByUserId(Long userId);
    AchievementDTO updateAchievement(AchievementBean achievementBean);
}
