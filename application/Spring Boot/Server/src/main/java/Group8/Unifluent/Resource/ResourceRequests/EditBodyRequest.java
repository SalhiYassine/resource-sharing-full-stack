package Group8.Unifluent.Resource.ResourceRequests;

import lombok.Getter;

import javax.validation.constraints.NotBlank;

@Getter
public class EditBodyRequest {

    @NotBlank
    private String body;

}
