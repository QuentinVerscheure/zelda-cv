package zeldaCV.bean;

public class AchievementBean {
    private Long userId; // Reference to User ID
    private boolean cv;
    private boolean cvDownload;
    private boolean portfolio;
    private boolean link;
    private boolean linkClick;
    private boolean phone;
    private boolean phoneContact;
    private boolean guestBook;
    private boolean guestBookComment;
    private boolean achievementVarious;
    private boolean achievementCredit;

    // Getters and Setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public boolean isCv() {
        return cv;
    }

    public void setCv(boolean cv) {
        this.cv = cv;
    }

    public boolean isCvDownload() {
        return cvDownload;
    }

    public void setCvDownload(boolean cvDownload) {
        this.cvDownload = cvDownload;
    }

    public boolean isPortfolio() {
        return portfolio;
    }

    public void setPortfolio(boolean portfolio) {
        this.portfolio = portfolio;
    }

    public boolean isLink() {
        return link;
    }

    public void setLink(boolean link) {
        this.link = link;
    }

    public boolean isLinkClick() {
        return linkClick;
    }

    public void setLinkClick(boolean linkClick) {
        this.linkClick = linkClick;
    }

    public boolean isPhone() {
        return phone;
    }

    public void setPhone(boolean phone) {
        this.phone = phone;
    }

    public boolean isPhoneContact() {
        return phoneContact;
    }

    public void setPhoneContact(boolean phoneContact) {
        this.phoneContact = phoneContact;
    }

    public boolean isGuestBook() {
        return guestBook;
    }

    public void setGuestBook(boolean guestBook) {
        this.guestBook = guestBook;
    }

    public boolean isGuestBookComment() {
        return guestBookComment;
    }

    public void setGuestBookComment(boolean guestBookComment) {
        this.guestBookComment = guestBookComment;
    }

    public boolean isAchievementVarious() {
        return achievementVarious;
    }

    public void setAchievementVarious(boolean achievementVarious) {
        this.achievementVarious = achievementVarious;
    }

    public boolean isAchievementCredit() {
        return achievementCredit;
    }

    public void setAchievementCredit(boolean achievementCredit) {
        this.achievementCredit = achievementCredit;
    }
}
