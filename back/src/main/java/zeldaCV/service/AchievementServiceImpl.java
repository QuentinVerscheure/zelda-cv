package zeldaCV.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import jakarta.persistence.EntityNotFoundException;
import zeldaCV.model.AchievementEntity;
import zeldaCV.bean.AchievementBean;
import zeldaCV.converter.AchievementMapper;
import zeldaCV.dto.AchievementDTO;
import zeldaCV.repository.AchievementRepository;
import zeldaCV.util.Achievement;

@Service
public class AchievementServiceImpl implements AchievementService {

    private final AchievementRepository achievementRepository;

    @Autowired
    public AchievementServiceImpl(AchievementRepository achievementRepository) {
        this.achievementRepository = achievementRepository;
    }

    @Override
    public AchievementDTO getAchievement() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String pseudo = authentication != null ? authentication.getName() : null;

        AchievementEntity achievementEntity = achievementRepository.findByUserPseudo(pseudo);
        if (achievementEntity == null) {
            throw new RuntimeException("No achievement found for pseudo: " + pseudo);
        }
        return AchievementMapper.beanToDto(AchievementMapper.entityToBean(achievementEntity));

    }

    @Override
    public AchievementDTO updateAchievement(AchievementBean newAchievementBean) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String pseudo = authentication != null ? authentication.getName() : null;

        AchievementEntity achievementEntity = achievementRepository.findByUserPseudo(pseudo);
        if (achievementEntity == null) {
            throw new EntityNotFoundException(
                    "No achievement found for pseudo: " + pseudo);
        }
        AchievementBean dbAchievementBean = AchievementMapper.entityToBean(achievementEntity);

        String[] fields = {
                "cv", "cvDownload", "portfolio", "link", "linkClick",
                "phone", "phoneContact", "guestBook", "guestBookComment",
                "achievementVarious", "achievementCredit"
        };

        java.util.function.Function<String, String> capitalize = str ->
            str.substring(0, 1).toUpperCase() + str.substring(1);

        for (String field : fields) {
            try {
                String methodSuffix = capitalize.apply(field);
                // Utilise dbAchievementBean pour le setter, pas AchievementEntity.class
                boolean oldValue = (boolean) AchievementEntity.class.getMethod("is" + methodSuffix).invoke(achievementEntity);
                boolean newValue = (boolean) AchievementBean.class.getMethod("is" + methodSuffix).invoke(newAchievementBean);

                if (!oldValue && newValue) {
                    AchievementBean.class.getMethod("set" + methodSuffix, boolean.class).invoke(dbAchievementBean, true);
                }
            } catch (Exception e) {
                throw new RuntimeException("Error updating achievement field: " + field, e);
            }
        }

        if (Achievement.checkAchievement(dbAchievementBean)) {
            AchievementMapper.beanToEntity(dbAchievementBean, achievementEntity);
            AchievementEntity updatedAchievement = achievementRepository.save(achievementEntity);
            return AchievementMapper.beanToDto(AchievementMapper.entityToBean(updatedAchievement));
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Achievements are not correct");
        }
    }
}
