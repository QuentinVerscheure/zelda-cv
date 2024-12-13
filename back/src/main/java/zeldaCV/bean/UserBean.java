package zeldaCV.bean;

import java.util.List;

public class UserBean {
    private Long id;
    private String pseudo;
    private String pass;
    private AchievementBean achievements;
    private List<CommentBean> comments;


    public UserBean(Long id, String pseudo, String pass) {
        this.id = id;
        this.pseudo = pseudo;
        this.pass = pass;
    }

    public UserBean(Long id, String pseudo, String pass, AchievementBean achievements, List<CommentBean> comments) {
        this.id = id;
        this.pseudo = pseudo;
        this.pass = pass;
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

    public void setPass(String pass) {
        this.pass = pass;
    }

    public String getPass() {
        return pass;
    }

    public String getPseudo() {
        return pseudo;
    }

    public void setPseudo(String pseudo) {
        this.pseudo = pseudo;
    }

    public AchievementBean getAchievements() {
        return achievements;
    }

    public void setAchievements(AchievementBean achievements) {
        this.achievements = achievements;
    }

    public List<CommentBean> getComments() {
        return comments;
    }

    public void setComments(List<CommentBean> comments) {
        this.comments = comments;
    }
}
