package Group8.Unifluent.Comment.CommentRequests;

import lombok.Getter;

import javax.validation.constraints.NotBlank;

@Getter
public class EditCommentBody {

    @NotBlank
    private String body;

}
