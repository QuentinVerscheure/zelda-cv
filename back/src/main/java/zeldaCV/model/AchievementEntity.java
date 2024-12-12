package zeldaCV.model;

import jakarta.persistence.*;

@Entity
@Table(name = "Achievement")
public class AchievementEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false, unique = true)
    private UserEntity user;

    // Achievements
    @Column(name = "cv")
    private boolean cv;

    @Column(name = "cv_download")
    private boolean cvDownload;

    @Column(name = "portfolio")
    private boolean portfolio;

    @Column(name = "link")
    private boolean link;

    @Column(name = "link_click")
    private boolean linkClick;

    @Column(name = "phone")
    private boolean phone;

    @Column(name = "phone_contact")
    private boolean phoneContact;

    @Column(name = "guest_book")
    private boolean guestBook;

    @Column(name = "guest_book_comment")
    private boolean guestBookComment;

    @Column(name = "achievement_various")
    private boolean achievementVarious;

    @Column(name = "achievement_credit")
    private boolean achievementCredit;

    // Default constructor
    public AchievementEntity() {}

    // Constructor with UserEntity
    public AchievementEntity(UserEntity user) {
        this.user = user;
        this.cv = false;
        this.cvDownload = false;
        this.portfolio = false;
        this.link = false;
        this.linkClick = false;
        this.phone = false;
        this.phoneContact = false;
        this.guestBook = false;
        this.guestBookComment = false;
        this.achievementVarious = false;
        this.achievementCredit = false;
    }

    // Constructor with arguments
    public AchievementEntity(UserEntity user, boolean cv, boolean cvDownload, boolean portfolio, boolean link, boolean linkClick,
                             boolean phone, boolean phoneContact, boolean guestBook, boolean guestBookComment,
                             boolean achievementVarious, boolean achievementCredit) {
        this.user = user;
        this.cv = cv;
        this.cvDownload = cvDownload;
        this.portfolio = portfolio;
        this.link = link;
        this.linkClick = linkClick;
        this.phone = phone;
        this.phoneContact = phoneContact;
        this.guestBook = guestBook;
        this.guestBookComment = guestBookComment;
        this.achievementVarious = achievementVarious;
        this.achievementCredit = achievementCredit;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
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

    @Override
    public String toString() {
        return "AchievementEntity{" +
                "user=" + user +
                ", cv=" + cv +
                ", cvDownload=" + cvDownload +
                ", portfolio=" + portfolio +
                ", link=" + link +
                ", linkClick=" + linkClick +
                ", phone=" + phone +
                ", phoneContact=" + phoneContact +
                ", guestBook=" + guestBook +
                ", guestBookComment=" + guestBookComment +
                ", achievementVarious=" + achievementVarious +
                ", achievementCredit=" + achievementCredit +
                '}';
    }
}
