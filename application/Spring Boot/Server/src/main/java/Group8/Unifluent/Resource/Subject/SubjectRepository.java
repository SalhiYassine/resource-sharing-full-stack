package Group8.Unifluent.Resource.Subject;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SubjectRepository extends JpaRepository<Subject, Long> {

    boolean existsBySubject(String subject);
    Optional<Subject> findBySubject(String subject);
}
