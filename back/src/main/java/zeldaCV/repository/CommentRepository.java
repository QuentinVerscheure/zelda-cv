package zeldaCV.repository;

import zeldaCV.model.CommentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<CommentEntity, Long> {

    // Custom method to find all comments by a specific pseudoId (User)
    List<CommentEntity> findByPseudoId(String pseudoId);
    
    // Custom method to find comments with specific X and Y coordinates
    List<CommentEntity> findByCoordinateXAndCoordinateY(Long coordinateX, Long coordinateY);
}
