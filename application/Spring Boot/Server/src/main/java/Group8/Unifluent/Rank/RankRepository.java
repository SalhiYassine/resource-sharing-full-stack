package Group8.Unifluent.Rank;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;

@Repository
public interface RankRepository extends JpaRepository<Rank, Long> {

    @Transactional
    @Modifying
    @Query("DELETE FROM Rank WHERE user_id = ?1")
    public void deleteByUserId(long user_id);
}