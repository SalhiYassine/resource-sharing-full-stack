package Group8.Unifluent.Profile;

import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long> {

    @Query("FROM Profile WHERE profile_id = ?1")
    public Profile findByProfileId(long profile_id);

}
