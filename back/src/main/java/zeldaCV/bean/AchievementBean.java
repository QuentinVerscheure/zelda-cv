package zeldaCV.bean;
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
public class AchievementBean {
    private Long Id;
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
}
