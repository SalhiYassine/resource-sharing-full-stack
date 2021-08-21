package Group8.Unifluent.Chat;

import javax.transaction.Transactional;

import Group8.Unifluent.User.User;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;


@Repository
public interface ChatRepository extends JpaRepository<Chat, Long> {

    @Query("FROM Chat WHERE chat_id = ?1")
    public Chat findByChatId(long chat_id);

    @Transactional
    @Modifying
    @Query("DELETE FROM Chat WHERE chat_id = ?1")
    public void deleteById(long chat_id);

}
