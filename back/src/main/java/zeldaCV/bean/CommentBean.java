package zeldaCV.bean;

public class CommentBean {
    private Long id;
    private String comment;
    private Long coordinateX;
    private Long coordinateY;
    private Long userId; // Lien vers l'utilisateur

    public CommentBean() {}

    public CommentBean(Long id, String comment, Long coordinateX, Long coordinateY, Long userId) {
        this.id = id;
        this.comment = comment;
        this.coordinateX = coordinateX;
        this.coordinateY = coordinateY;
        this.userId = userId;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Long getCoordinateX() {
        return coordinateX;
    }

    public void setCoordinateX(Long coordinateX) {
        this.coordinateX = coordinateX;
    }

    public Long getCoordinateY() {
        return coordinateY;
    }

    public void setCoordinateY(Long coordinateY) {
        this.coordinateY = coordinateY;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
