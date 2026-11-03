package zeldaCV.bean;

import java.time.LocalDateTime;

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
    private String pseudo;
    private String comment;
    private int coordinateX;
    private int coordinateY;
    /** Creation date, in UTC. */
    private LocalDateTime createdAt;
}
