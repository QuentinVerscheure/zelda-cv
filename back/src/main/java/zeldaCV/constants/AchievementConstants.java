package zeldaCV.constants;

//if this field is change, you have to change the AchievementEntity too because JPA cannot support dynamic set up to the entity fields
public class AchievementConstants {
    public static final String[] ACHIEVEMENT_FIELDS = {
            "cv",
            "cvDownload",
            "portfolio",
            "link",
            "linkClick",
            "phone",
            "phoneContact",
            "guestBook",
            "guestBookComment",
            "achievementVarious",
            "achievementCredit"
    };
};