package Group8.Unifluent.Resource.Subject;

import Group8.Unifluent.Resource.Resource;
import Group8.Unifluent.Resource.ResourceRepository;
import Group8.Unifluent.Resource.ResourceRequests.EditSubjectRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("api/subjects")
@RestController
public class SubjectController {

    @Autowired
    SubjectRepository subjectRepository;

    @Autowired
    ResourceRepository resourceRepository;


    // TODO : GET all subjects

    @GetMapping("/getAll")
    public ResponseEntity<?> getAllSubjects() {

        if(!subjectRepository.findAll().isEmpty()){
            List<Subject> subjectList = subjectRepository.findAll();
            return new ResponseEntity<>(subjectList, HttpStatus.OK);
        }
        return new ResponseEntity<>("There are no subjects... This is awkward!", HttpStatus.NOT_FOUND);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/addOne")
    public ResponseEntity<?> addSubject(@Valid @RequestBody EditSubjectRequest subjectRequest) {

        if(!subjectRepository.existsBySubject(subjectRequest.getSubject())){
            Subject subject = new Subject(subjectRequest.getSubject());
            subjectRepository.save(subject);
            return new ResponseEntity<>("Subject added!", HttpStatus.OK);
        };
        return new ResponseEntity<>("Subject already exists!", HttpStatus.NOT_ACCEPTABLE);

    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/editOne")
    public ResponseEntity<?> editSubject(@Valid @RequestBody EditSubjectRequest subjectRequest) {

        if(!subjectRepository.existsBySubject(subjectRequest.getSubject())){
            Subject subject = new Subject(subjectRequest.getSubject());
            subjectRepository.save(subject);
            return new ResponseEntity<>("Subject edited!", HttpStatus.OK);
        };
        return new ResponseEntity<>("Subject does not exists!", HttpStatus.NOT_ACCEPTABLE);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/removeOne/{id}")
    public ResponseEntity<?> removeSubject(@PathVariable(name = "id") Long id) {
        if(resourceRepository.existsBySubjectId(id) == false){
            subjectRepository.delete(subjectRepository.findById(id).get());
            return new ResponseEntity<>("Subject deleted!", HttpStatus.OK);
        }
        return new ResponseEntity<>("Resources are using this Subject!", HttpStatus.NOT_ACCEPTABLE);
    }



}
