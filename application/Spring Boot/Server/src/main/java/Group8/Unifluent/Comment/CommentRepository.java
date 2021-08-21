package Group8.Unifluent.Comment;

import Group8.Unifluent.Resource.Resource;
import Group8.Unifluent.User.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findCommentsByResource(Resource resource);
    List<Comment> findCommentsByUser(User user);

}
