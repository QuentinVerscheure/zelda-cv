package zeldaCV.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "Achievement")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
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
}
