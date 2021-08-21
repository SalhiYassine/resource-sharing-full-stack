package Group8.Unifluent.Message;

import org.springframework.data.jpa.repository.Query;
import javax.transaction.Transactional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.JpaRepository;


@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    @Transactional
    @Modifying
    @Query("DELETE FROM Message WHERE message_id = ?1")
    public void deleteById(long message_id);

    @Transactional
    @Modifying
    @Query("DELETE FROM Message WHERE chat_id = ?1")
    public void deleteByChatId(long chat_id);
}