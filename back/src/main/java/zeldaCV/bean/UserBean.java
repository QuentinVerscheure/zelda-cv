package zeldaCV.bean;

import java.util.List;

public class UserBean {
    private Long id;
    private String pseudo;
    private List<AchievementBean> achievements;
    private List<CommentBean> comments;


    public UserBean(Long id, String pseudo) {
        this.id = id;
        this.pseudo = pseudo;
    }

    public UserBean(Long id, String pseudo, List<AchievementBean> achievements, List<CommentBean> comments) {
        this.id = id;
        this.pseudo = pseudo;
        this.comments = comments;
        this.achievements = achievements;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPseudo() {
        return pseudo;
    }

    public void setPseudo(String pseudo) {
        this.pseudo = pseudo;
    }

    public List<AchievementBean> getAchievements() {
        return achievements;
    }

    public void setAchievements(List<AchievementBean> achievements) {
        this.achievements = achievements;
    }

    public List<CommentBean> getComments() {
        return comments;
    }

    public void setComments(List<CommentBean> comments) {
        this.comments = comments;
    }
}
