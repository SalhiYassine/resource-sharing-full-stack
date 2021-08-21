package Group8.Unifluent.Profile;

import javax.persistence.*;

import Group8.Unifluent.User.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import org.springframework.web.multipart.MultipartFile;

@Entity
@Table(name = "profiles")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class MultipartFileProfile {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long profile_id;
    private String nickname;
    private Boolean is_private;
    private String course;
    private String strongest_subject;
    private String description;
    @Lob
    private MultipartFile picture;

    @OneToOne(mappedBy = "profile")
    @JsonIgnore
    private User user;
}

