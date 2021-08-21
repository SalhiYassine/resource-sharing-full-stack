package Group8.Unifluent.Comment;

import Group8.Unifluent.Resource.Resource;
import Group8.Unifluent.User.User;
import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter @Setter @AllArgsConstructor @NoArgsConstructor
public class Comment {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 500)
    private String body;

    private LocalDateTime date_created;

    private LocalDateTime date_updated;

    @ManyToOne(fetch= FetchType.LAZY)
    @JoinColumn(name="user_id")
    private User user;

    @ManyToOne(fetch= FetchType.LAZY)
    @JoinColumn(name="resource_id")
    @JsonIgnore
    private Resource resource;

    public Comment(@NotBlank @Size(max = 500) String body) {
        this.body = body;
        this.date_created = LocalDateTime.now();
    }
}
