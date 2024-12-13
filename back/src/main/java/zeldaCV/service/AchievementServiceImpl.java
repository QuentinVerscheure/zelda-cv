package zeldaCV.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import zeldaCV.model.AchievementEntity;
import zeldaCV.bean.AchievementBean;
import zeldaCV.constants.AchievementConstants;
import zeldaCV.converter.AchievementMapper;
import zeldaCV.dto.AchievementDTO;
import zeldaCV.repository.AchievementRepository;
import zeldaCV.util.Achievement;

import java.lang.reflect.Method;

@Service
public class AchievementServiceImpl implements AchievementService {

    private final AchievementRepository achievementRepository;

    @Autowired
    public AchievementServiceImpl(AchievementRepository achievementRepository) {
        this.achievementRepository = achievementRepository;
    }

    @Override
    public AchievementDTO getAchievementByUserId(Long userId) {
        return achievementRepository.findByUserId(userId)
                .map(AchievementMapper::entityToBean)
                .map(AchievementMapper::beanToDTO)
                .orElseThrow(() -> new RuntimeException("Achievement not found for user ID: " + userId));
    }

    @Override
    public AchievementDTO updateAchievement(AchievementBean newAchievementBean) {

        // get the achievement from the DB for the user because not all Achievement are
        // present/update in newAchievementBean
        AchievementEntity dbAchievementEntity = achievementRepository.findById(newAchievementBean.getUserId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Achievement not found for user ID: " + newAchievementBean.getUserId()));
        AchievementBean dbAchievementBean = AchievementMapper.entityToBean(dbAchievementEntity);

        // take the new achievement in newAchievementBean and replace them in
        // dbAchievementBean
        String[] achievements = AchievementConstants.ACHIEVEMENT_FIELDS;
        try {
            for (String achievement : achievements) {
                // Getter and setter methods for both dbAchievementBean and newAchievementBean
                Method getMethod = AchievementBean.class.getMethod("is" + achievement);
                Method setMethod = AchievementBean.class.getMethod("set" + achievement, boolean.class);

                // Get the value from newAchievementBean
                Boolean newValue = (Boolean) getMethod.invoke(newAchievementBean);

                // If the new value is present (i.e., true), update the value in
                // dbAchievementBean
                if (newValue != null && newValue) {
                    setMethod.invoke(dbAchievementBean, newValue);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        // check the validity of the new achievements and save if ok
        if (Achievement.checkAchievement(dbAchievementBean)) {
            AchievementEntity achievementEntity = AchievementMapper.beanToEntity(dbAchievementBean);
            AchievementEntity updatedAchievement = achievementRepository.save(achievementEntity);
            return AchievementMapper.beanToDTO(AchievementMapper.entityToBean(updatedAchievement));
        } else {
            throw new UnsupportedOperationException("Achievement not valid");
        }
    }
}
