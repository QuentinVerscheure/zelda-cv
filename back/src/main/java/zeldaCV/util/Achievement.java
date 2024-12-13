package zeldaCV.util;

import zeldaCV.bean.AchievementBean;

public class Achievement {
    /**
     * Verifies the user's achievements.
     * This method takes an {@link AchievementBean} and checks that achievements are
     * valid betwen them
     *
     * @param achievementBean The {@link AchievementBean} object containing the
     *                        achievement details to verify.
     * @return {@code true} if all conditions are met, otherwise {@code false}.
     */
    public static boolean checkAchievement(AchievementBean achievementBean) {

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
