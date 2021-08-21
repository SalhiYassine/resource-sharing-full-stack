package Group8.Unifluent.Resource;

import Group8.Unifluent.Comment.Comment;
import Group8.Unifluent.Resource.Subject.Subject;
import Group8.Unifluent.User.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Resource {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 30)
    private String title;

    @NotBlank @Size(max = 50)
    private String description;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="subject_id")
    private Subject subject;

    @NotBlank @Size(max = 100000)
    private String body;

    private LocalDateTime date_created;

    private LocalDateTime date_updated;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="user_id")
    private User user;

    @OneToMany(
            mappedBy = "resource",
            orphanRemoval = true,
            cascade = CascadeType.ALL
    )
    @JsonIgnore
    private List<Comment> comments = new ArrayList<>();

    public Resource(@NotBlank @Size(max = 30) String title,
                    @NotBlank @Size(max = 50) String description,
                    Subject subject,
                    @NotBlank @Size(max = 100000) String body
                    ) {
        this.title = title;
        this.description = description;
        this.subject = subject;
        this.body = body;
        this.date_created = LocalDateTime.now();
    }
}
