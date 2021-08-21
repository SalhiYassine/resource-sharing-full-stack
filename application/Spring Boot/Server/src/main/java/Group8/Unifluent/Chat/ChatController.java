package Group8.Unifluent.Chat;

import Group8.Unifluent.MessageImage.MessageImageRepository;
import Group8.Unifluent.User.UserRepository;
import Group8.Unifluent.User.User;
import Group8.Unifluent.Message.MessageRepository;
import Group8.Unifluent.Message.Message;

import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.io.InputStream;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.Optional;
import java.util.List;

import javax.persistence.EntityManagerFactory;

import org.hibernate.Hibernate;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
public class ChatController {

    @Autowired
    ChatRepository chatRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    MessageRepository messageRepository;

    @Autowired
    MessageImageRepository messageImageRepository;

    @Autowired
    private EntityManagerFactory entityManagerFactory;

    @CrossOrigin
    @GetMapping("/chat/{id}")
    public Optional<Chat> chat(@PathVariable(value = "id") long chat_id) throws IOException, SQLException {
        return chatRepository.findById(chat_id);
    }

    @CrossOrigin
    @GetMapping("/messages/{id}")
    public List<Message> messages(@PathVariable(value = "id") long chat_id) throws IOException, SQLException {
        return chatRepository.findById(chat_id).get().getMessages();
    }

    @CrossOrigin
    @RequestMapping(value = "/chat-picture/{id}", method=RequestMethod.GET, produces = MediaType.IMAGE_PNG_VALUE)
    public @ResponseBody byte[] chatPicture(@PathVariable(value = "id") long chat_id) throws SQLException {
        Blob picture = chatRepository.findByChatId(chat_id).getPicture();
        if(picture == null) return null;
        return picture.getBytes(1, (int) picture.length());
    }

    @CrossOrigin
    @PostMapping("/add-chat")
    public void addChat(@ModelAttribute MultipartFileChat multipartFileChat) throws IOException{
        InputStream multipartFilePicture = multipartFileChat.getPicture().getInputStream();
        Session session = (Session) entityManagerFactory.createEntityManager().getDelegate();
        Blob picture = Hibernate.getLobCreator(session).createBlob(multipartFilePicture, multipartFileChat.getPicture().getSize());

        Chat chat = new Chat();
        chat.setChat_id(multipartFileChat.getChat_id());
        chat.setName(multipartFileChat.getName());
        chat.setDate_updated(multipartFileChat.getDate_updated());
        chat.setPicture(picture);
        chat.setUsers(multipartFileChat.getUsers());
        for(int i = 0; i < chat.getUsers().size(); i++){
            chat.getUsers().get(i).addChat(chat);
        }
        chatRepository.save(chat);
    }

    @CrossOrigin
    @PutMapping("/edit-chat")
    public void editChat(@ModelAttribute MultipartFileChat multipartFileChat) throws IOException{
        InputStream multipartFilePicture = multipartFileChat.getPicture().getInputStream();
        Session session = (Session) entityManagerFactory.createEntityManager().getDelegate();
        Blob picture = Hibernate.getLobCreator(session).createBlob(multipartFilePicture, multipartFileChat.getPicture().getSize());

        Chat chat = chatRepository.findByChatId(multipartFileChat.getChat_id());
        chat.setName(multipartFileChat.getName());
        chat.setDate_updated(multipartFileChat.getDate_updated());
        chat.setPicture(picture);

        chatRepository.save(chat);
    }

    @CrossOrigin
    @PutMapping("/delete-chat/{id}")
    public void deleteChat(@PathVariable(value = "id") long chat_id){
        Chat chat = chatRepository.findByChatId(chat_id);
        for(int i = 0; i < chat.getUsers().size(); i++){
            chat.getUsers().get(i).removeChat(chat);
            userRepository.save(chat.getUsers().get(i));
        }
        messageRepository.deleteByChatId(chat_id);
        chatRepository.deleteById(chat_id);
        messageImageRepository.deleteByChatId(chat_id);
    }

    @CrossOrigin
    @PutMapping("/update-chat-date")
    public void updateChatDate(@RequestBody Chat input){
        Chat chat = chatRepository.findByChatId(input.getChat_id());
        chat.setDate_updated(input.getDate_updated());
        chatRepository.save(chat);
    }

    @CrossOrigin
    @PutMapping("/add-user-to-chat/{chat_id}/{user_id}")
    public void addUserToChat(@PathVariable(value = "chat_id") long chat_id, @PathVariable(value = "user_id") long user_id){
        Chat chat = chatRepository.findByChatId(chat_id);
        User user = userRepository.findById(user_id).get();
        chat.addUser(user);
        user.addChat(chat);
        chatRepository.save(chat);
        userRepository.save(user);
    }

    @CrossOrigin
    @PutMapping("/remove-user-from-chat/{chat_id}/{user_id}")
    public void removeUserFromChat(@PathVariable(value = "chat_id") long chat_id, @PathVariable(value = "user_id") long user_id){
        Chat chat = chatRepository.findByChatId(chat_id);
        User user = userRepository.findById(user_id).get();
        chat.removeUser(user);
        user.removeChat(chat);
        chatRepository.save(chat);
        userRepository.save(user);
    }
}