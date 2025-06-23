package zeldaCV.repository;

import zeldaCV.model.CommentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<CommentEntity, Long> {

    List<CommentEntity> findByCoordinateXAndCoordinateY(Long coordinateX, Long coordinateY);

    List<CommentEntity> findByUserPseudo(String pseudo);

    /**
     * Returns all comments from the DB that are within the rectangle defined by
     * (X - width, X + width) and (Y - height, Y + height) around the given commentBean.
     * usefull for collision detection when a new comment is created.
     */
    @Query("SELECT c FROM CommentEntity c WHERE " +
           "c.coordinateX BETWEEN :minX AND :maxX AND " +
           "c.coordinateY BETWEEN :minY AND :maxY")
    List<CommentEntity> findNearbyComments(
        @Param("minX") int minX,
        @Param("maxX") int maxX,
        @Param("minY") int minY,
        @Param("maxY") int maxY
    );

    boolean existsByIdAndUserPseudo(Long id, String userPseudo);
}
