package zeldaCV.repository;

import zeldaCV.model.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {

    // Custom method to find a user by their pseudo (username)
    Optional<UserEntity> findByPseudo(String pseudo);
    
    // Custom method to check if a user with a specific pseudo exists
    boolean existsByPseudo(String pseudo);
    
    // Custom method to delete a user by their pseudo
    void deleteByPseudo(String pseudo);
}
