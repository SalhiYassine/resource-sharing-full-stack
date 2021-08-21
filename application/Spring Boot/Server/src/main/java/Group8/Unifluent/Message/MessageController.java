package Group8.Unifluent.Message;

import Group8.Unifluent.Chat.ChatRepository;
import Group8.Unifluent.MessageImage.MessageImageRepository;
import Group8.Unifluent.User.UserRepository;
import Group8.Unifluent.User.User;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

@RestController
public class MessageController {

    @Autowired
    MessageRepository messageRepository;

    @Autowired
    ChatRepository chatRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    MessageImageRepository messageImageRepository;

    @CrossOrigin
    @GetMapping("/message-user/{id}")
    public User messageUser(@PathVariable(value = "id") long message_id) throws IOException, SQLException {
        return messageRepository.findById(message_id).get().getUser();
    }

    @CrossOrigin
    @PostMapping("/add-message")
    public Message addMessage(@RequestBody MessageRequest messageRequest){
        Message message = new Message();
        message.setMessage(messageRequest.getMessage());
        message.setDate(messageRequest.getDate());
        message.setChat(chatRepository.findByChatId(messageRequest.getChat_id()));
        message.setUser(userRepository.findById(messageRequest.getUser_id()).get());
        messageRepository.save(message);
        message.getChat().addMessage(message);
        message.getUser().addMessage(message);
        return message;
    }

    @CrossOrigin
    @PutMapping("/edit-message")
    public void editMessage(@RequestBody Message input){
        Message message = messageRepository.findById(input.getMessage_id()).get();
        message.setMessage(input.getMessage());
        messageRepository.save(message);
    }

    @CrossOrigin
    @DeleteMapping("/delete-message/{id}")
    public void deleteMessage(@PathVariable(value = "id") long message_id){
        Message message = messageRepository.findById(message_id).get();
        message.getChat().removeMessage(message);
        message.getUser().removeMessage(message);
        if(message.getMessageImage() != null){
            message.getMessageImage().setMessage(null);
            message.setMessageImage(null);
        }
        messageRepository.save(message);
        messageRepository.deleteById(message_id);
    }

    @CrossOrigin
    @GetMapping("/message-read-by/{id}")
    public List<User> messageReadBy(@PathVariable(value = "id") long message_id) throws IOException, SQLException {
        return messageRepository.findById(message_id).get().getReadBy();
    }

    @CrossOrigin
    @PutMapping("/message-add-read-by/{message_id}/{user_id}")
    public void messageAddReadBy(@PathVariable(value = "message_id") long message_id, @PathVariable(value = "user_id") long user_id){
        Message message = messageRepository.findById(message_id).get();
        User user = userRepository.findById(user_id).get();
        message.addReadBy(user);
        user.addReadBy(message);
        messageRepository.save(message);
    }

}
