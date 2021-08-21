package Group8.Unifluent.MessageImage;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;


@Repository
public interface MessageImageRepository extends JpaRepository<MessageImage, Long> {
    @Transactional
    @Modifying
    @Query("DELETE FROM MessageImage WHERE chat_id = ?1")
    public void deleteByChatId(long chat_id);
}