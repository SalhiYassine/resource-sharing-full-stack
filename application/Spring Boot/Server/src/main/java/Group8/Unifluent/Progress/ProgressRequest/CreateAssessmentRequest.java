package Group8.Unifluent.Progress.ProgressRequest;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotBlank;
import java.time.LocalDate;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor @AllArgsConstructor
public class CreateAssessmentRequest {

    @NotBlank
    private String title;

    private String course;

    private String subject;

    @JsonFormat(pattern="yyyy-MM-dd")
    private Date date;

    private String gradeType;

    private String grade;
}
