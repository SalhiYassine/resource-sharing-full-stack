package Group8.Unifluent.Resource;

import Group8.Unifluent.Resource.Subject.Subject;
import Group8.Unifluent.User.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {

    List<Resource> getResourcesByUser(User user);
    List<Resource> getResourcesBySubject(Subject subject);
    Boolean existsBySubjectId(long subject_id);

}


