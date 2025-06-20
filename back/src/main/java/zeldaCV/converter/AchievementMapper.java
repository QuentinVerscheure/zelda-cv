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

    public static AchievementDTO beanToDto(AchievementBean achievementBean) {
        if (achievementBean == null) return null;
        AchievementDTO achievementDto = new AchievementDTO();
        achievementDto.setCv(achievementBean.isCv());
        achievementDto.setCvDownload(achievementBean.isCvDownload());
        achievementDto.setPortfolio(achievementBean.isPortfolio());
        achievementDto.setLink(achievementBean.isLink());
        achievementDto.setLinkClick(achievementBean.isLinkClick());
        achievementDto.setPhone(achievementBean.isPhone());
        achievementDto.setPhoneContact(achievementBean.isPhoneContact());
        achievementDto.setGuestBook(achievementBean.isGuestBook());
        achievementDto.setGuestBookComment(achievementBean.isGuestBookComment());
        achievementDto.setAchievementVarious(achievementBean.isAchievementVarious());
        achievementDto.setAchievementCredit(achievementBean.isAchievementCredit());
        return achievementDto;
    }

    public static AchievementBean dtoToBean(AchievementDTO achievementDto) {
        if (achievementDto == null) return null;
        AchievementBean bean = new AchievementBean();
        bean.setCv(achievementDto.isCv());
        bean.setCvDownload(achievementDto.isCvDownload());
        bean.setPortfolio(achievementDto.isPortfolio());
        bean.setLink(achievementDto.isLink());
        bean.setLinkClick(achievementDto.isLinkClick());
        bean.setPhone(achievementDto.isPhone());
        bean.setPhoneContact(achievementDto.isPhoneContact());
        bean.setGuestBook(achievementDto.isGuestBook());
        bean.setGuestBookComment(achievementDto.isGuestBookComment());
        bean.setAchievementVarious(achievementDto.isAchievementVarious());
        bean.setAchievementCredit(achievementDto.isAchievementCredit());
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

