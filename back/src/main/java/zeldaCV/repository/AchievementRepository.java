package zeldaCV.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import zeldaCV.model.AchievementEntity;

import java.util.Optional;

@Repository
public interface AchievementRepository extends JpaRepository<AchievementEntity, Long> {
    
    // Method to find an achievement by the user ID
    Optional<AchievementEntity> findByUserId(Long userId);

    // Method to delete an achievement by user ID
    void deleteByUserId(Long userId);
}
