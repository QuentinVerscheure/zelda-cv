package zeldaCV.service;

import zeldaCV.bean.AchievementBean;
import zeldaCV.dto.AchievementDTO;


public interface AchievementService {
    AchievementDTO getAchievement();
    AchievementDTO updateAchievement(AchievementBean achievementBean);
}
