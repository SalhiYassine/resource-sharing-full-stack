package Group8.Unifluent.MessageImage;

import Group8.Unifluent.Message.Message;
import Group8.Unifluent.Message.MessageRepository;
import org.hibernate.Hibernate;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityManagerFactory;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.Optional;

@RestController
public class MessageImageController {

    @Autowired
    MessageImageRepository messageImageRepository;

    @Autowired
    MessageRepository messageRepository;

    @Autowired
    private EntityManagerFactory entityManagerFactory;

    @CrossOrigin
    @RequestMapping(value = "/message-image/{id}", method=RequestMethod.GET, produces = MediaType.IMAGE_PNG_VALUE)
    public @ResponseBody byte[] messageImage(@PathVariable(value = "id") long message_image_id) throws SQLException {
        Optional<MessageImage> messageImage = messageImageRepository.findById(message_image_id);
        if(messageImage.get() != null){
            Blob image = messageImage.get().getImage();
            if(image == null) return null;
            return image.getBytes(1, (int) image.length());
        } else {
            return null;
        }
    }

    @CrossOrigin
    @RequestMapping(value = "/add-message-image/{id}", method=RequestMethod.POST)
    public void addMessageImage(@PathVariable(value = "id") long message_id, @ModelAttribute MultipartMessageImage multipartMessageImage) throws IOException {
        Message message = messageRepository.findById(message_id).get();

        InputStream multipartFileImage = multipartMessageImage.getImage().getInputStream();
        Session session = (Session) entityManagerFactory.createEntityManager().getDelegate();
        Blob image = Hibernate.getLobCreator(session).createBlob(multipartFileImage, multipartMessageImage.getImage().getSize());

        MessageImage messageImage = new MessageImage();
        messageImage.setImage(image);
        messageImage.setMessage(message);
        messageImage.setChat_id(multipartMessageImage.getChat_id());
        message.setMessageImage(messageImage);
        messageImageRepository.save(messageImage);
    }
}
