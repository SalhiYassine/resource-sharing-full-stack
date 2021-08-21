package Group8.Unifluent.Role;

import java.util.Optional;

import Group8.Unifluent.Role.ERole;
import Group8.Unifluent.Role.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
	Optional<Role> findByName(ERole name);
}
