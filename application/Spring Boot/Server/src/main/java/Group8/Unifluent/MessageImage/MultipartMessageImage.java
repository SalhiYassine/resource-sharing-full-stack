package Group8.Unifluent.MessageImage;

import lombok.*;
import javax.persistence.*;
import org.springframework.web.multipart.MultipartFile;

@Entity
@Table(name = "multipart_message_images")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MultipartMessageImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long message_image_id;

    @Lob
    private MultipartFile image;

    private Long chat_id;
}
