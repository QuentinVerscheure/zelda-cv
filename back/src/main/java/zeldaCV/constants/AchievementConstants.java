package zeldaCV.constants;

//if this field is change, you have to change the AchievementEntity too because JPA cannot support dynamic set up to the entity fields
//TODO: find a way to make this dynamic, maybe with a map or something like that

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