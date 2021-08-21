package Group8.Unifluent.Chat;

import Group8.Unifluent.Message.Message;
import Group8.Unifluent.User.User;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "chats")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class MultipartFileChat {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long chat_id;
    private String name;
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime date_updated;
    @Lob
    private MultipartFile picture;

    @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL, mappedBy = "chats")
    @JsonIgnore
    private List<User> users = new ArrayList<>();

    @OneToMany(
            mappedBy = "chat",
            orphanRemoval = true,
            cascade = CascadeType.ALL
    )
    @JsonIgnore
    private List<Message> messages = new ArrayList<>();
}
