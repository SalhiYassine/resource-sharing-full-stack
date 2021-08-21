package Group8.Unifluent.Chat;

import Group8.Unifluent.Message.Message;
import Group8.Unifluent.User.User;

import java.sql.Blob;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;


@Entity
@Table(name = "chats")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Chat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long chat_id;
    private String name;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime date_updated;
    @Lob
    private Blob picture;

    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL, mappedBy = "chats")
    private List<User> users = new ArrayList<>();

    @OneToMany(
            mappedBy = "chat",
            orphanRemoval = true,
            cascade = CascadeType.ALL
    )
    @JsonIgnore
    private List<Message> messages = new ArrayList<>();

    public boolean addUser(User user){
        if(!users.contains(user)){
            users.add(user);
            return true;
        }
        return false;
    }

    public boolean removeUser(User user){
        if(users.contains(user)){
            users.remove(user);
            return true;
        }
        return false;
    }

    public boolean addMessage(Message message){
        if(!messages.contains(message)){
            messages.add(message);
            return true;
        }
        return false;
    }

    public boolean removeMessage(Message message){
        if(messages.contains(message)){
            messages.remove(message);
            return true;
        }
        return false;
    }
}
