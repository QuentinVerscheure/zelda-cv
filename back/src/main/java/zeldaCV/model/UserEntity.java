package zeldaCV.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "User")
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "pseudo", nullable = false, unique = true)
    private String pseudo;

    @Column(name = "pass", nullable = false)
    private String pass;

    // Relation OneToMany with CommentEntity
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CommentEntity> comments;

    // Relation OneToOne with AchievementEntity
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private AchievementEntity achievement;

    // Default constructor
    public UserEntity() {}

    // Constructor with arguments
    public UserEntity(String pseudo, String pass) {
        this.pseudo = pseudo;
        this.pass = pass;
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

    public String getPass() {
        return pass;
    }

    public void setPass(String pass) {
        this.pass = pass;
    }

    public List<CommentEntity> getComments() {
        return comments;
    }

    public void setComments(List<CommentEntity> comments) {
        this.comments = comments;
    }

    public AchievementEntity getAchievement() {
        return achievement;
    }

    public void setAchievement(AchievementEntity achievement) {
        this.achievement = achievement;
    }

    @Override
    public String toString() {
        return "UserEntity{" +
                "id=" + id +
                ", pseudo='" + pseudo + '\'' +
                ", pass='" + pass + '\'' +
                ", comments=" + comments +
                ", achievement=" + achievement +
                '}';
    }
}
