package Group8.Unifluent.Progress;

import Group8.Unifluent.Resource.Resource;
import Group8.Unifluent.User.User;
import Group8.Unifluent.User.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import Group8.Unifluent.Progress.ProgressRequest.CreateAssessmentRequest;
import Group8.Unifluent.Payload.Requests.*;


import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("api/progress")
public class ProgressController {

    @Autowired
    ProgressRepository progressRepository;
    @Autowired
    RequestService requestService;
    @Autowired
    UserRepository userRepository;


    @PostMapping("/createAssessment")
    public ResponseEntity<?> createAssessment(
            @RequestHeader("Authorization") String authToken,
            @Valid @RequestBody CreateAssessmentRequest progressRequest){

        User user = requestService.fetchUserFromAuthHeader(authToken);
        Progress progress = new Progress(progressRequest.getTitle(),
                progressRequest.getCourse(),
                progressRequest.getSubject(),
                progressRequest.getDate(),
                progressRequest.getGradeType(),
                progressRequest.getGrade());

        //System.out.println(progressRequest);


        user.addAssessment(progress);
        userRepository.save(user);
        return new ResponseEntity<>(user.getProgressList(), HttpStatus.OK);
    }

    @GetMapping("/getAssessment")
    public ArrayList<Progress> getAssessment(){
        ArrayList<Progress> assessment = new ArrayList<Progress>();
        progressRepository.findAll().forEach(assessment :: add);
        return assessment;
    }

    @GetMapping ("/getAll")
    public ResponseEntity<?> getAllProgress(@RequestHeader("Authorization") String authToken) {

        User user = requestService.fetchUserFromAuthHeader(authToken);
        if(!user.getProgressList().isEmpty()){
            List<Progress> assessments = user.getProgressList();
            return new ResponseEntity<>(assessments, HttpStatus.OK);
        }
        return new ResponseEntity<>("There are no assessments", HttpStatus.NOT_FOUND);
    }
}
