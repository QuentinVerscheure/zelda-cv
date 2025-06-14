package zeldaCV.converter;

import zeldaCV.bean.AchievementBean;
import zeldaCV.dto.AchievementDTO;
import zeldaCV.model.AchievementEntity;

public class AchievementMapper {

    public static AchievementBean entityToBean(AchievementEntity achievementEntity) {
        if (achievementEntity == null) return null;
        AchievementBean bean = new AchievementBean();
        bean.setId(achievementEntity.getId());
        bean.setCv(achievementEntity.isCv());
        bean.setCvDownload(achievementEntity.isCvDownload());
        bean.setPortfolio(achievementEntity.isPortfolio());
        bean.setLink(achievementEntity.isLink());
        bean.setLinkClick(achievementEntity.isLinkClick());
        bean.setPhone(achievementEntity.isPhone());
        bean.setPhoneContact(achievementEntity.isPhoneContact());
        bean.setGuestBook(achievementEntity.isGuestBook());
        bean.setGuestBookComment(achievementEntity.isGuestBookComment());
        bean.setAchievementVarious(achievementEntity.isAchievementVarious());
        bean.setAchievementCredit(achievementEntity.isAchievementCredit());
        return bean;
    }

    public static AchievementDTO beanToDto(AchievementBean bean) {
        if (bean == null) return null;
        AchievementDTO dto = new AchievementDTO();
        dto.setId(bean.getId());
        dto.setCv(bean.isCv());
        dto.setCvDownload(bean.isCvDownload());
        dto.setPortfolio(bean.isPortfolio());
        dto.setLink(bean.isLink());
        dto.setLinkClick(bean.isLinkClick());
        dto.setPhone(bean.isPhone());
        dto.setPhoneContact(bean.isPhoneContact());
        dto.setGuestBook(bean.isGuestBook());
        dto.setGuestBookComment(bean.isGuestBookComment());
        dto.setAchievementVarious(bean.isAchievementVarious());
        dto.setAchievementCredit(bean.isAchievementCredit());
        return dto;
    }

    public static AchievementBean dtoToBean(AchievementDTO dto) {
        if (dto == null) return null;
        AchievementBean bean = new AchievementBean();
        bean.setId(dto.getId());
        bean.setCv(dto.isCv());
        bean.setCvDownload(dto.isCvDownload());
        bean.setPortfolio(dto.isPortfolio());
        bean.setLink(dto.isLink());
        bean.setLinkClick(dto.isLinkClick());
        bean.setPhone(dto.isPhone());
        bean.setPhoneContact(dto.isPhoneContact());
        bean.setGuestBook(dto.isGuestBook());
        bean.setGuestBookComment(dto.isGuestBookComment());
        bean.setAchievementVarious(dto.isAchievementVarious());
        bean.setAchievementCredit(dto.isAchievementCredit());
        return bean;
    }

    public static AchievementEntity beanToEntity(AchievementBean bean, AchievementEntity achievementEntity) {
        if (bean == null) return null;
        achievementEntity.setId(bean.getId());
        achievementEntity.setCv(bean.isCv());
        achievementEntity.setCvDownload(bean.isCvDownload());
        achievementEntity.setPortfolio(bean.isPortfolio());
        achievementEntity.setLink(bean.isLink());
        achievementEntity.setLinkClick(bean.isLinkClick());
        achievementEntity.setPhone(bean.isPhone());
        achievementEntity.setPhoneContact(bean.isPhoneContact());
        achievementEntity.setGuestBook(bean.isGuestBook());
        achievementEntity.setGuestBookComment(bean.isGuestBookComment());
        achievementEntity.setAchievementVarious(bean.isAchievementVarious());
        achievementEntity.setAchievementCredit(bean.isAchievementCredit());
        return achievementEntity;
    }
}

