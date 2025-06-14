package zeldaCV.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import zeldaCV.model.AchievementEntity;
import zeldaCV.bean.AchievementBean;
import zeldaCV.constants.AchievementConstants;
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
    public AchievementDTO getAchievementByUserId(Long userId) {
        return achievementRepository.findByUserId(userId)
                .map(AchievementMapper::entityToBean)
                .map(AchievementMapper::beanToDto)
                .orElseThrow(() -> new RuntimeException("Achievement not found for user ID: " + userId));
    }

    @Override
    public AchievementDTO updateAchievement(AchievementBean newAchievementBean) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String pseudo = authentication != null ? authentication.getName() : null;

        AchievementEntity achievementEntity = achievementRepository.findByUserPseudo(pseudo);
        if (achievementEntity == null) {
            throw new EntityNotFoundException(
                    "Achievement not found for actual user");
        }
        AchievementBean dbAchievementBean = AchievementMapper.entityToBean(achievementEntity);

        dbAchievementBean.setCv(newAchievementBean.isCv());
        dbAchievementBean.setCvDownload(newAchievementBean.isCvDownload());
        dbAchievementBean.setPortfolio(newAchievementBean.isPortfolio());
        dbAchievementBean.setLink(newAchievementBean.isLink());
        dbAchievementBean.setLinkClick(newAchievementBean.isLinkClick());
        dbAchievementBean.setPhone(newAchievementBean.isPhone());
        dbAchievementBean.setPhoneContact(newAchievementBean.isPhoneContact());
        dbAchievementBean.setGuestBook(newAchievementBean.isGuestBook());
        dbAchievementBean.setGuestBookComment(newAchievementBean.isGuestBookComment());
        dbAchievementBean.setAchievementVarious(newAchievementBean.isAchievementVarious());
        dbAchievementBean.setAchievementCredit(newAchievementBean.isAchievementCredit());

        if (Achievement.checkAchievement(dbAchievementBean)) {
            AchievementMapper.beanToEntity(dbAchievementBean, achievementEntity);
            AchievementEntity updatedAchievement = achievementRepository.save(achievementEntity);
            return AchievementMapper.beanToDto(AchievementMapper.entityToBean(updatedAchievement));
        } else {
            throw new UnsupportedOperationException("Achievement not valid");
        }
    }
}

