package Group8.Unifluent.Profile;
import Group8.Unifluent.User.User;

import java.sql.Blob;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.AccessLevel;

@Entity
@Table(name = "profiles")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Profile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long profile_id;
    private String nickname;
    private Boolean is_private;
    private String course;
    private String strongest_subject;
    private String description;
    @Lob
    private Blob picture;

    @OneToOne(cascade = CascadeType.ALL, mappedBy = "profile")
    @JsonIgnore
    private User user;
}
