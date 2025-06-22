package zeldaCV.bean;
import java.sql.Date;

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
public class CommentBean {
    private Long id;
    private String comment;
    private int coordinateX;
    private int coordinateY;
    private Long userId;
    private String userPseudo;
    private Date date;
}
