package Group8.Unifluent.Resource;

import Group8.Unifluent.Payload.Requests.*;
import Group8.Unifluent.Resource.ResourceRequests.*;
import Group8.Unifluent.Resource.Subject.Subject;
import Group8.Unifluent.Resource.Subject.SubjectRepository;
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
@RequestMapping("api/resources")
@RestController
public class ResourceController {

    @Autowired
    RequestService requestService;
    @Autowired
    UserRepository userRepository;
    @Autowired
    ResourceRepository resourceRepository;
    @Autowired
    SubjectRepository subjectRepository;

    // TODO : GET all resources

    @GetMapping ("/getAll")
    public ResponseEntity<?> getAllResources() {

        if(!resourceRepository.findAll().isEmpty()){
            List<Resource> resources = resourceRepository.findAll();
            return new ResponseEntity<>(resources, HttpStatus.OK);
        }
        return new ResponseEntity<>("There are no resources... This is awkward!", HttpStatus.NOT_FOUND);
    }

    // TODO : GET all resources

    @PostMapping ("/getAll/Subject")
    public ResponseEntity<?> getAllResourcesBySubject(@Valid @RequestBody EditSubjectRequest subject) {

        if(subjectRepository.existsBySubject(subject.getSubject())){
            Subject subjectModel = subjectRepository.findBySubject(subject.getSubject()).get();
            List<Resource> resources = resourceRepository.getResourcesBySubject(subjectModel);
            return new ResponseEntity<>(resources, HttpStatus.OK);

        }
        return new ResponseEntity<>("There are no resources... This is awkward!", HttpStatus.NOT_FOUND);
    }

    // TODO : GET one resource

    @GetMapping ("/getOne/{id}")
    public ResponseEntity<?> getOneResource(@PathVariable(name = "id") Long id) {

        if(resourceRepository.findById(id).isPresent()){
            Resource resource = resourceRepository.findById(id).get();
            return new ResponseEntity<>(resource, HttpStatus.OK);
        }
        return new ResponseEntity<>( "That resource does not exist!", HttpStatus.NOT_FOUND);
    }

    // TODO : GET the user's specific resources

    @GetMapping ("/getOwn")
    public ResponseEntity<?> getOwnResources(
            @RequestHeader("Authorization") String authToken) {

        User user = requestService.fetchUserFromAuthHeader(authToken);
        if(!resourceRepository.getResourcesByUser(user).isEmpty()){
            List<Resource> userResources = resourceRepository.getResourcesByUser(user);
            return new ResponseEntity<>( userResources, HttpStatus.OK);
        }
        return new ResponseEntity<>( "You have not created any resources yet!", HttpStatus.NOT_FOUND);
    }

    @GetMapping ("/getUserResources/{user_id}")
    public ResponseEntity<?> getUserResources(
            @RequestHeader("Authorization") String authToken, @PathVariable(value="user_id") long user_id) {
        User user = userRepository.findById(user_id).get();
        if(!resourceRepository.getResourcesByUser(user).isEmpty()){
            List<Resource> userResources = resourceRepository.getResourcesByUser(user);
            return new ResponseEntity<>( userResources, HttpStatus.OK);
        }
        return new ResponseEntity<>( "This users has not created any resources yet!", HttpStatus.NOT_FOUND);
    }


    // TODO : POST one resource

    @PostMapping ("/create")
    public ResponseEntity<?> createResource(
            @RequestHeader("Authorization") String authToken,
            @Valid @RequestBody CreateResourceRequest resourceRequest) {


        if(subjectRepository.existsBySubject(resourceRequest.getSubject())){
            Subject subject = subjectRepository.findBySubject(resourceRequest.getSubject()).get();
            User user = requestService.fetchUserFromAuthHeader(authToken);
            Resource resource = new Resource( resourceRequest.getTitle(),
                    resourceRequest.getDescription(),
                    subject,
                    resourceRequest.getBody());

            user.addResource(resource);
            userRepository.save(user);
            return new ResponseEntity<>("Resource successfully Created!", HttpStatus.OK);
        };
        return new ResponseEntity<>("Subject does not exist!", HttpStatus.NOT_FOUND);
    }

    // TODO : DELETE one resource

    //TODO : Ensure only users can delete their own posts
    @CrossOrigin
    @DeleteMapping ("/deleteOne/{id}")
    public ResponseEntity<?> deleteOneResource(
            @RequestHeader("Authorization") String authToken,
            @PathVariable(name = "id") Long id) {

        User user = requestService.fetchUserFromAuthHeader(authToken);
        if(resourceRepository.findById(id).isPresent()){
            Resource resource = resourceRepository.findById(id).get();
            if(resource.getUser().equals(user)){
                user.removeResource(resource);
                userRepository.save(user);
                return new ResponseEntity<>("Resource was successfully deleted", HttpStatus.OK);
            }
            return new ResponseEntity<>("Resource exists but user does not have permission to delete that resource!", HttpStatus.UNAUTHORIZED);
        }
        return new ResponseEntity<>("Resource does not exist!", HttpStatus.NOT_FOUND);
    }

    // TODO : PATCH one resource - title

    @PatchMapping("/updateOne/{id}/title")
    public ResponseEntity<?> updateResourceTitle(@RequestHeader("Authorization") String authToken,
                                      @PathVariable(name = "id") Long id,
                                      @Valid @RequestBody EditTitleRequest request){

        User user = requestService.fetchUserFromAuthHeader(authToken);
        if(resourceRepository.findById(id).isPresent()){
            Resource resource = resourceRepository.findById(id).get();
            if(resource.getUser().equals(user)){
                resource.setTitle(request.getTitle());
                resource.setDate_updated(LocalDateTime.now());
                resourceRepository.save(resource);
                return new ResponseEntity<>("Successfully edited the title!", HttpStatus.OK);
            }
            return new ResponseEntity<>( "Resource exists but user does not have permission to edit that resource!", HttpStatus.UNAUTHORIZED);
        }
        return new ResponseEntity<>("Resource does not exist!", HttpStatus.NOT_FOUND);
    }

    // TODO : PATCH one resource - description

    @PatchMapping("/updateOne/{id}/description")
    public ResponseEntity<?> updateResourceDescription(@RequestHeader("Authorization") String authToken,
                                      @PathVariable(name = "id") Long id,
                                      @Valid @RequestBody EditDescriptionRequest request){

        User user = requestService.fetchUserFromAuthHeader(authToken);
        if(resourceRepository.findById(id).isPresent()){
            Resource resource = resourceRepository.findById(id).get();
            if(resource.getUser().equals(user)){
                resource.setDescription(request.getDescription());
                resource.setDate_updated(LocalDateTime.now());
                resourceRepository.save(resource);
                return new ResponseEntity<>("Successfully edited the description!", HttpStatus.OK);
            }
            return new ResponseEntity<>( "Resource exists but user does not have permission to edit that resource!", HttpStatus.UNAUTHORIZED);
        }
        return new ResponseEntity<>("Resource does not exist!", HttpStatus.NOT_FOUND);
    }

    @PatchMapping("/updateOne/{id}/subject")
    public ResponseEntity<?> updateResourceSubject(@RequestHeader("Authorization") String authToken,
                                                       @PathVariable(name = "id") Long id,
                                                       @Valid @RequestBody EditSubjectRequest request){

        User user = requestService.fetchUserFromAuthHeader(authToken);
        if(resourceRepository.findById(id).isPresent()){
            Resource resource = resourceRepository.findById(id).get();
            if(resource.getUser().equals(user)){
                if(subjectRepository.existsBySubject(request.getSubject())){
                    Subject subject = subjectRepository.findBySubject(request.getSubject()).get();
                    resource.setSubject(subject);
                    resource.setDate_updated(LocalDateTime.now());
                    resourceRepository.save(resource);
                    return new ResponseEntity<>("Successfully edited the subject!", HttpStatus.OK);
                }
            }
            return new ResponseEntity<>( "Resource exists but user does not have permission to edit that resource!", HttpStatus.UNAUTHORIZED);
        }
        return new ResponseEntity<>("Resource does not exist!", HttpStatus.NOT_FOUND);
    }

    // TODO : PATCH one resource - body

    @PatchMapping("/updateOne/{id}/body")
    public ResponseEntity<?> updateResourceBody(@RequestHeader("Authorization") String authToken,
                                            @PathVariable(name = "id") Long id,
                                            @Valid @RequestBody EditBodyRequest request){

        User user = requestService.fetchUserFromAuthHeader(authToken);
        if(resourceRepository.findById(id).isPresent()){
            Resource resource = resourceRepository.findById(id).get();
            if(resource.getUser().equals(user)){
                resource.setBody(request.getBody());
                resource.setDate_updated(LocalDateTime.now());
                resourceRepository.save(resource);
                return new ResponseEntity<>("Successfully edited the body!", HttpStatus.OK);
            }
            return new ResponseEntity<>( "Resource exists but user does not have permission to edit that resource!", HttpStatus.UNAUTHORIZED);
        }
        return new ResponseEntity<>("Resource does not exist!", HttpStatus.NOT_FOUND);
    }
}


