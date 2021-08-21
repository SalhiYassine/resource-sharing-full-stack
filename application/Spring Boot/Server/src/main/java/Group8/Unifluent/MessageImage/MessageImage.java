package Group8.Unifluent.MessageImage;

import Group8.Unifluent.Message.Message;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import javax.persistence.*;
import java.sql.Blob;

@Entity
@Table(name = "message_images")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MessageImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.PROTECTED)
    private Long message_image_id;

    @Lob
    private Blob image;

    @OneToOne(cascade = CascadeType.ALL, mappedBy = "messageImage", orphanRemoval = false)
    @JsonIgnore
    private Message message;

    private Long chat_id;
}
