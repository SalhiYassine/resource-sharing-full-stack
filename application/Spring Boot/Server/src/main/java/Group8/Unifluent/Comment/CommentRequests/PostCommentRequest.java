package Group8.Unifluent.Comment.CommentRequests;

import lombok.Getter;

import javax.validation.constraints.NotBlank;

@Getter
public class PostCommentRequest {

    @NotBlank
    private String body;
}
