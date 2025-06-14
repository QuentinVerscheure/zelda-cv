package zeldaCV.repository;

import zeldaCV.model.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {

    Optional<UserEntity> findByPseudo(String pseudo);
    
    boolean existsByPseudo(String pseudo);
    
    void deleteByPseudo(String pseudo);

}
