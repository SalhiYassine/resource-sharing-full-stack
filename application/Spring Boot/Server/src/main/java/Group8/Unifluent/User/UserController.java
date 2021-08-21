package Group8.Unifluent.User;

import Group8.Unifluent.Chat.Chat;
import Group8.Unifluent.Payload.Requests.RequestService;
import Group8.Unifluent.Profile.Profile;

import Group8.Unifluent.Rank.Rank;
import Group8.Unifluent.Rank.RankRepository;
import Group8.Unifluent.Resource.Resource;
import Group8.Unifluent.Resource.ResourceRepository;
import Group8.Unifluent.User.UserRequest.EmailRequest;
import Group8.Unifluent.User.UserRequest.PasswordRequest;
import Group8.Unifluent.User.UserRequest.UserNameRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.sql.SQLException;

import java.util.List;
import java.util.Optional;
import java.util.Set;


@RestController
public class UserController {
    @Autowired
    RequestService requestService;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    ResourceRepository resourceRepository;

    @Autowired
    RankRepository rankRepository;

    @CrossOrigin
    @GetMapping("/users")
    public List<User> getUsers() {
        return userRepository.findAll();
    }

    @CrossOrigin
    @GetMapping("/user/{id}")
    public Optional<User> getUser(@PathVariable(value = "id") long user_id) throws IOException, SQLException {
        return userRepository.findById(user_id);
    }

    @CrossOrigin
    @GetMapping("/user-by-username/{username}")
    public Optional<User> getUserByUsername(@PathVariable(value = "username") String username) throws IOException, SQLException {
        return userRepository.findByUsername(username);
    }

    @CrossOrigin
    @GetMapping("/profile/{id}")
    public Profile getProfile(@PathVariable(value = "id") long user_id) {
        if(userRepository.findById(user_id).get().getProfile() == null){
            return null;
        } else {
            return userRepository.findById(user_id).get().getProfile();
        }
    }

    @CrossOrigin
    @GetMapping("/chats/{id}")
    public List<Chat> getChats(@PathVariable(value = "id") long user_id) {
        return userRepository.findById(user_id).get().getChats();
    }

    @CrossOrigin
    @PostMapping("/save-resource/{user_id}/{resource_id}")
    public Set<Resource> saveResource(@PathVariable(value = "user_id") long userId, @PathVariable(value = "resource_id") long resourceId){
        User user = userRepository.findById(userId).get();
        Resource resource = resourceRepository.findById(resourceId).get();
        Set<Resource> savedResources = user.getSavedResources();
        savedResources.add(resource);
        user.setSavedResources(savedResources);
        userRepository.save(user);
        return savedResources;
    }

    @CrossOrigin
    @GetMapping("/saved-resources/{user_id}")
    public Set<Resource> getUserSavedResources(@PathVariable(value = "user_id") long userId){
        User user = userRepository.findById(userId).get();
        return user.getSavedResources();
    }

    @CrossOrigin
    @GetMapping("/remove-saved-resource/{user_id}/{resource_id}")
    public boolean deleteSavedResource(
            @PathVariable(value = "user_id") long user_id,
            @PathVariable(value = "resource_id") long resource_id
    ){
        User user = userRepository.findById(user_id).get();
        Set<Resource> savedResources = user.getSavedResources();
        savedResources.removeIf(s -> s.getId() == resource_id);
        user.setSavedResources(savedResources);
        userRepository.save(user);
        return true;
    }


    @CrossOrigin
    @GetMapping("/colleagues/{id}")
    public List<User> getColleagues(@PathVariable(value = "id") long user_id) {
        return userRepository.findById(user_id).get().getColleagues();
    }

    @CrossOrigin
    @PostMapping("/add-colleague/{user_id_1}/{user_id_2}")
    public String addColleague(@PathVariable(value="user_id_1") long user_id_1, @PathVariable(value="user_id_2") long user_id_2){
        User user1 = userRepository.findById(user_id_1).get();
        User user2 = userRepository.findById(user_id_2).get();
        user1.addColleague(user2);
        user2.addColleague(user1);
        userRepository.save(user1);
        userRepository.save(user2);
        return "User Added as Colleague";
    }

    @CrossOrigin
    @PostMapping("/remove-colleague/{user_id_1}/{user_id_2}")
    public String removeColleague(@PathVariable(value="user_id_1") long user_id_1, @PathVariable(value="user_id_2") long user_id_2){
        User user1 = userRepository.findById(user_id_1).get();
        User user2 = userRepository.findById(user_id_2).get();
        user1.removeColleague(user2);
        user2.removeColleague(user1);
        userRepository.save(user1);
        userRepository.save(user2);
        return "User Removed as Colleague";
    }

    @CrossOrigin
    @GetMapping("/colleague-requests-received/{id}")
    public List<User> getColleagueRequestsReceived(@PathVariable(value = "id") long user_id) {
        return userRepository.findById(user_id).get().getColleagueRequestsReceived();
    }

    @CrossOrigin
    @GetMapping("/colleague-requests-sent/{id}")
    public List<User> getColleagueRequestsSent(@PathVariable(value = "id") long user_id) {
        return userRepository.findById(user_id).get().getColleagueRequestsSent();
    }

    @CrossOrigin
    @PostMapping("/add-request-colleague/{user_id_1}/{user_id_2}")
    public String addRequestColleague(@PathVariable(value="user_id_1") long user_id_1, @PathVariable(value="user_id_2") long user_id_2){
        User user1 = userRepository.findById(user_id_1).get();
        User user2 = userRepository.findById(user_id_2).get();
        user1.addColleagueRequestSent(user2);
        user2.addColleagueRequestReceived(user1);
        userRepository.save(user1);
        userRepository.save(user2);
        return "Colleague Request Added";
    }

    @CrossOrigin
    @PostMapping("/remove-request-colleague/{user_id_1}/{user_id_2}")
    public String removeRequestColleague(@PathVariable(value="user_id_1") long user_id_1, @PathVariable(value="user_id_2") long user_id_2){
        User user1 = userRepository.findById(user_id_1).get();
        User user2 = userRepository.findById(user_id_2).get();
        user1.removeColleagueRequestSent(user2);
        user2.removeColleagueRequestReceived(user1);
        userRepository.save(user1);
        userRepository.save(user2);
        return "Colleague Request Removed";
    }

    @CrossOrigin
    @GetMapping("get-ranks/{user_id}")
    public List<Rank> getRanks(@PathVariable(value="user_id") long user_id){
        return userRepository.findById(user_id).get().getRanks();
    }

    @CrossOrigin
    @GetMapping("has-marked/{user_id_1}/{user_id_2}")
    public String getRanks(@PathVariable(value="user_id_1") long user_id_1, @PathVariable(value="user_id_2") long user_id_2){
        List<Rank> ranks = userRepository.findById(user_id_1).get().getRanks();
        User user = userRepository.findById(user_id_2).get();
        for(int i = 0; i < ranks.size(); i++){
            if(user == ranks.get(i).getMarkedBy()) return ranks.get(i).getRank();
        }
        return "";
    }

    @CrossOrigin
    @PostMapping("rank-user/{user_id_1}/{user_id_2}/{rank}")
    public void rankUser(@PathVariable(value="user_id_1") long user_id_1, @PathVariable(value="user_id_2") long user_id_2, @PathVariable(value="rank") String markedRank){
        User user = userRepository.findById(user_id_1).get();
        User markedBy = userRepository.findById(user_id_2).get();
        Rank rank = new Rank();
        rank.setRank(markedRank);
        rank.setUser(user);
        rank.setMarkedBy(markedBy);
        user.addRank(rank);
        rankRepository.save(rank);
        userRepository.save(user);
    }

    @CrossOrigin
    @PutMapping("change-rank/{user_id_1}/{user_id_2}/{rank}")
    public void changeRank(@PathVariable(value="user_id_1") long user_id_1, @PathVariable(value="user_id_2") long user_id_2, @PathVariable(value="rank") String markedRank){
        User user = userRepository.findById(user_id_1).get();
        User markedBy = userRepository.findById(user_id_2).get();
        List<Rank> ranks = userRepository.findById(user_id_1).get().getRanks();
        Rank rank = new Rank();
        for(int i = 0; i < ranks.size(); i++){
            if(markedBy == ranks.get(i).getMarkedBy()) rank = ranks.get(i);
        }
        rank.setRank(markedRank);
        rankRepository.save(rank);
    }

    @CrossOrigin
    @PatchMapping("/update-username")
    public ResponseEntity<?> updateUsername(@RequestBody UserNameRequest usernameRequest)  {
        //return new ResponseEntity<>( "Username does not exists!", HttpStatus.NOT_FOUND );
        if(userRepository.existsById(usernameRequest.getUser_id()) == false){
            return new ResponseEntity<>( "Account does not exists!", HttpStatus.NOT_FOUND );
        } else {
            User existingUser = userRepository.findById(usernameRequest.getUser_id()).get();
            existingUser.setUsername(usernameRequest.getUsername());
            userRepository.save(existingUser);
             return new ResponseEntity<>("Username successfully Updated!", HttpStatus.OK);

        }
        //Group8.Unifluent.Settings.Settings settings = new Settings();
        //settings.setUsername(usernameRequest.getUsername());
        //settingsRepository.save(settings);

    }

    @CrossOrigin
    @PatchMapping("/update-email")
    public ResponseEntity<?> updateEmail(@RequestBody EmailRequest emailRequest)  {
        //return new ResponseEntity<>( "Username does not exists!", HttpStatus.NOT_FOUND );
        if(userRepository.existsById(emailRequest.getUser_id()) == false){
            return new ResponseEntity<>( "Account does not exists!", HttpStatus.NOT_FOUND );
        } else {
            User existingUser = userRepository.findById(emailRequest.getUser_id()).get();
            existingUser.setEmail(emailRequest.getEmail());
            userRepository.save(existingUser);
            return new ResponseEntity<>("Email successfully Updated!", HttpStatus.OK);

        }

    }

    @CrossOrigin
    @PatchMapping("/update-password")
    public ResponseEntity<?> updatePassword(@RequestBody PasswordRequest passwordRequest) {
        //return new ResponseEntity<>( "Username does not exists!", HttpStatus.NOT_FOUND );
        if (userRepository.existsById(passwordRequest.getUser_id()) == false) {
            return new ResponseEntity<>("Account does not exists!", HttpStatus.NOT_FOUND);
        } else {
            User existingUser = userRepository.findById(passwordRequest.getUser_id()).get();

            existingUser.setPassword(encoder.encode(passwordRequest.getPassword()));
            userRepository.saveAndFlush(existingUser);
            //userRepository.flush();

            return new ResponseEntity<>("Password successfully Updated!", HttpStatus.OK);

        }
    }

    // TODO : DELETE one resource

    //TODO : Ensure only users can delete their own posts
    @CrossOrigin
    @DeleteMapping ("/deleteAcc/{id}")
    public ResponseEntity<?> deleteAccount(
            @RequestHeader("Authorization") String authToken,
            @PathVariable(name = "id") Long id) {

        User currentUser = requestService.fetchUserFromAuthHeader(authToken);
        if(userRepository.findById(id).isPresent()){
            User user = userRepository.findById(id).get();
            if(user.getUsername().equals(currentUser.getUsername())){
                userRepository.delete(user);
                //userRepository.saveAndFlush(user);
                return new ResponseEntity<>("Account was successfully deleted", HttpStatus.OK);
            }
            return new ResponseEntity<>("Account exists but user does not have permission to delete that resource!", HttpStatus.UNAUTHORIZED);
        }
        return new ResponseEntity<>("Account does not exist!", HttpStatus.NOT_FOUND);
    }


}
