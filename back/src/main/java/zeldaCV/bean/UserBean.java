package zeldaCV.bean;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
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
}
