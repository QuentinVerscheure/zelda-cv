package zeldaCV.dto;

import java.util.List;

public class UserDTO {
    private Long id;
    private String pseudo;
    private String pass;
    private List<CommentDTO> comments;
    private AchievementDTO achievement;

    // Default constructor
    public UserDTO() {
    }

    // Constructor with arguments
    public UserDTO(Long id, String pseudo,String pass, AchievementDTO achievement) {
        this.id = id;
        this.pseudo = pseudo;
        this.pass = pass;
        this.achievement = achievement;
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

    public void setPass(String pass) {
        this.pass = pass;
    }

    public String getPass() {
        return pass;
    }


    public void setPseudo(String pseudo) {
        this.pseudo = pseudo;
    }

    public List<CommentDTO> getComments() {
        return comments;
    }

    public void setComments(List<CommentDTO> comments) {
        this.comments = comments;
    }

    public AchievementDTO getAchievement() {
        return achievement;
    }

    public void setAchievement(AchievementDTO achievement) {
        this.achievement = achievement;
    }

    @Override
    public String toString() {
        return "UserDTO{" +
                "id=" + id +
                ", pseudo='" + pseudo + '\'' +
                ", comments=" + comments +
                ", achievement=" + achievement +
                '}';
    }
}
