package Group8.Unifluent.Comment;

import Group8.Unifluent.Comment.CommentRequests.PostCommentRequest;
import Group8.Unifluent.Payload.Requests.RequestService;
import Group8.Unifluent.Resource.Resource;
import Group8.Unifluent.Resource.ResourceRepository;
import Group8.Unifluent.Resource.ResourceRequests.CreateResourceRequest;
import Group8.Unifluent.Resource.ResourceRequests.EditBodyRequest;
import Group8.Unifluent.User.User;
import Group8.Unifluent.User.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("api/comments")
public class CommentController {

    @Autowired
    CommentRepository commentRepository;

    @Autowired
    ResourceRepository resourceRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RequestService requestService;

    // TODO : POST a comment on a resource

    @PostMapping ("/createOnSpecific/{id}")
    public ResponseEntity<?> createCommentOnResource(
            @PathVariable(name = "id") Long id,
            @RequestHeader("Authorization") String authToken,
            @Valid @RequestBody PostCommentRequest postCommentRequest) {

        User user = requestService.fetchUserFromAuthHeader(authToken);

        if(resourceRepository.findById(id).isPresent()){
            Resource resource = resourceRepository.findById(id).get();
            Comment comment = new Comment(postCommentRequest.getBody());
            user.addComment(resource, comment);
            userRepository.save(user);
            return new ResponseEntity<>( "Comment Successfully Posted", HttpStatus.OK);
        }
        return new ResponseEntity<>("That resource does not exist, you cannot post a comment on an invalid resource!", HttpStatus.NOT_FOUND);
    }

    // TODO : GET all comments on a specific post

    @GetMapping ("/getAllOnSpecific/{id}")
    public ResponseEntity<?> getCommentsOnResource(
            @PathVariable(name = "id") Long id) {

        if(resourceRepository.findById(id).isPresent()){
            Resource resource = resourceRepository.findById(id).get();
            List<Comment> comments = commentRepository.findCommentsByResource(resource);
            if(!comments.isEmpty()){
                return new ResponseEntity<>(comments, HttpStatus.OK);
            }
            return new ResponseEntity<>("This resource does not have any comments yet!", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>("This resource could not be found", HttpStatus.NOT_FOUND);
    }

    // TODO : GET a specific comment

    @GetMapping ("/getOneComment/{id}")
    public ResponseEntity<?> getOneCommentOnResource(
            @PathVariable(name = "id") Long id) {

        if(commentRepository.findById(id).isPresent()){
            Comment comment = commentRepository.findById(id).get();
            return new ResponseEntity<>(comment, HttpStatus.OK);
        }
        return new ResponseEntity<>("This comment does not exist!", HttpStatus.NOT_FOUND);
    }

    // TODO : GET comments the current user has posted

    @GetMapping("/getOwn")
    public ResponseEntity<?> getOwnComments(
            @RequestHeader("Authorization") String authToken){

        User user = requestService.fetchUserFromAuthHeader(authToken);
        List<Comment> comments = commentRepository.findCommentsByUser(user);
        if(!comments.isEmpty()){
            return new ResponseEntity<>(comments, HttpStatus.OK);
        }
        return new ResponseEntity<>("You do not have any comments yet!, post a comment and come back.", HttpStatus.NOT_FOUND);
    }

    // TODO : DELETE a specific comment

    @DeleteMapping ("/deleteOneComment/{id}")
    public ResponseEntity<?>  deleteOneComment(
            @PathVariable(name = "id") Long id,
            @RequestHeader("Authorization") String authToken) {

        User user = requestService.fetchUserFromAuthHeader(authToken);

        if(commentRepository.findById(id).isPresent()){
            Comment comment = commentRepository.findById(id).get();
            if (comment.getUser().equals(user)) {
                user.removeComment(comment);
                userRepository.save(user);
                return new ResponseEntity<>( "Comment Successfully Deleted", HttpStatus.OK);
            }
            return new ResponseEntity<>("Comment does exist but you do not have permission to delete it!", HttpStatus.UNAUTHORIZED);
        }
        return new ResponseEntity<>( "This comment does not exist, check the id and try again!", HttpStatus.NOT_FOUND);
    }

    // TODO : PATCH one comment

    @PatchMapping("/updateOne/{id}/body")
    public ResponseEntity<?> updateResourceBody(@RequestHeader("Authorization") String authToken,
                                     @PathVariable(name = "id") Long id,
                                     @Valid @RequestBody EditBodyRequest request){

        User user = requestService.fetchUserFromAuthHeader(authToken);
        if(commentRepository.findById(id).isPresent()) {
            Comment comment = commentRepository.findById(id).get();
            if (comment.getUser().equals(user)) {
                comment.setBody(request.getBody());
                comment.setDate_updated(LocalDateTime.now());
                commentRepository.save(comment);
                return new ResponseEntity<>("Successfully edited the body!", HttpStatus.OK);
            }
            return new ResponseEntity<>("This comment does exist but you do not have permission to edit it!", HttpStatus.UNAUTHORIZED);
        }
        return new ResponseEntity<>("This comment does not exist, please check the id and try again!", HttpStatus.NOT_FOUND);
    }

}
