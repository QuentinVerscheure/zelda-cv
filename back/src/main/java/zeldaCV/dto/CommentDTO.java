package zeldaCV.dto;

public class CommentDTO {
    private Long id;
    private String comment;
    private Long coordinateX;
    private Long coordinateY;
    private Long userId; 
    private String userPseudo;

    public CommentDTO() {}

    public CommentDTO(Long id, String comment, Long coordinateX, Long coordinateY, Long userId, String userPseudo) {
        this.id = id;
        this.comment = comment;
        this.coordinateX = coordinateX;
        this.coordinateY = coordinateY;
        this.userId = userId;
        this.userPseudo = userPseudo;
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

    public String getUserPseudo() {
        return userPseudo;
    }

    public void setUserPseudo(String userPseudo) {
        this.userPseudo = userPseudo;
    }
}
