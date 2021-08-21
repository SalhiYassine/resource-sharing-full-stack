package Group8.Unifluent.Message;

import Group8.Unifluent.Chat.Chat;
import Group8.Unifluent.MessageImage.MessageImage;
import Group8.Unifluent.Profile.Profile;
import Group8.Unifluent.User.User;
import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.AccessLevel;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

@Entity
@Table(name = "messages")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.PROTECTED)
    private Long message_id;
    private String message;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime date;

    @ManyToOne(cascade = CascadeType.ALL,
            fetch = FetchType.EAGER)
    @JoinColumn(name="chat_id")
    private Chat chat;

    @ManyToOne(cascade = CascadeType.ALL,
            fetch = FetchType.EAGER)
    @JoinColumn(name="user_id")
    private User user;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    @JoinColumn(name = "message_image_id", referencedColumnName = "message_image_id")
    private MessageImage messageImage;

    @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinTable(
            name = "messages_read_by",
            joinColumns = @JoinColumn(name = "message_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @JsonIgnore
    private List<User> readBy = new ArrayList<>();

    public boolean addReadBy(User user){
        if(!readBy.contains(user)){
            readBy.add(user);
            return true;
        }
        return false;
    }

    public boolean removeReadBy(User user){
        if(readBy.contains(user)){
            readBy.remove(user);
            return true;
        }
        return false;
    }
}
