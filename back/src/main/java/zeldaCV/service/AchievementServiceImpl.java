package zeldaCV.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import zeldaCV.model.AchievementEntity;
import zeldaCV.bean.AchievementBean;
import zeldaCV.constants.AchievementConstants;
import zeldaCV.converter.AchievementMapper;
import zeldaCV.repository.AchievementRepository;

import java.util.List;
import java.util.stream.Collectors;

import java.lang.reflect.Method;

@Service
public class AchievementServiceImpl implements AchievementService {

    private final AchievementRepository achievementRepository;

    @Autowired
    public AchievementServiceImpl(AchievementRepository achievementRepository) {
        this.achievementRepository = achievementRepository;
    }

    @Override
    public List<AchievementBean> getAllAchievements() {
        return achievementRepository.findAll().stream()
                .map(AchievementMapper::entityToBean)
                .collect(Collectors.toList());
    }

    @Override
    public AchievementBean getAchievementByUserId(Long userId) {
        return achievementRepository.findByUserId(userId)
                .map(AchievementMapper::entityToBean)
                .orElse(null); // or throw a custom exception if not found
    }

    @Override
    public AchievementBean updateAchievement(AchievementBean newAchievementBean) {

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
            for (String field : achievements) {
                // Getter and setter methods for both dbAchievementBean and newAchievementBean
                Method getMethod = AchievementBean.class.getMethod("is" + field);
                Method setMethod = AchievementBean.class.getMethod("set" + field, boolean.class);

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
        if (checkAchievement(dbAchievementBean)) {
            AchievementEntity achievementEntity = AchievementMapper.beanToEntity(dbAchievementBean);
            AchievementEntity updatedAchievement = achievementRepository.save(achievementEntity);
            return AchievementMapper.entityToBean(updatedAchievement);
        } else {
            throw new UnsupportedOperationException("Achievement not valid");
        }
    }

    /**
     * Verifies the user's achievements.
     * This method takes an {@link AchievementBean} and checks that achievements are valid betwen them
     *
     * @param achievementBean The {@link AchievementBean} object containing the achievement details to verify.
     * @return {@code true} if all conditions are met, otherwise {@code false}.
     */
    private boolean checkAchievement(AchievementBean achievementBean) {

        // if the player send a comment but never enter the house where you can do it
        if (achievementBean.isGuestBookComment() && !achievementBean.isGuestBook()) {
            return false;
        }
        if (achievementBean.isLinkClick() && !achievementBean.isLink()) {
            return false;
        }
        if (achievementBean.isPhoneContact() && !achievementBean.isPhone()) {
            return false;
        }

        return true;
    }

}
