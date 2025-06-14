package zeldaCV.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import zeldaCV.model.AchievementEntity;

import java.util.Optional;

@Repository
public interface AchievementRepository extends JpaRepository<AchievementEntity, Long> {
    
    Optional<AchievementEntity> findByUserId(Long userId);

    void deleteByUserId(Long userId);

    @Query("SELECT achievement FROM AchievementEntity achievement WHERE achievement.user.pseudo = :pseudo")
    AchievementEntity findByUserPseudo(@Param("pseudo") String pseudo);
}
