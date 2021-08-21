package Group8.Unifluent.Progress;

import Group8.Unifluent.User.User;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
//import jdk.vm.ci.meta.Local;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Progress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String course;
    private String subject;
    @JsonFormat(pattern="yyyy-MM-dd") private Date date;
    private String gradeType;
    private String grade;

    @ManyToOne(fetch= FetchType.LAZY)
    @JoinColumn(name= "user_id")
    @JsonIgnore
    private User user;


    public Progress(String title, String course, String subject, Date date, String gradeType, String grade) {
        this.title = title;
        this.course = course;
        this.subject = subject;
        this.date = date;
        this.gradeType = gradeType;
        this.grade = grade;
    }
}
