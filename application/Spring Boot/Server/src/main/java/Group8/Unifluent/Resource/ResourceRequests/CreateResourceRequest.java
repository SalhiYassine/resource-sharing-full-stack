package Group8.Unifluent.Resource.ResourceRequests;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;

@Getter
@Setter
public class CreateResourceRequest {

    @NotBlank
    private String title;
    @NotBlank
    private String description;
    @NotBlank
    private String subject;
    @NotBlank
    private String body;


}
