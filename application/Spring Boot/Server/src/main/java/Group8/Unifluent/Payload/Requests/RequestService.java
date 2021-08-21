package Group8.Unifluent.Payload.Requests;

import Group8.Unifluent.Security.JWT.JwtUtils;
import Group8.Unifluent.User.User;
import Group8.Unifluent.User.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class RequestService {

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    UserRepository userRepository;

    public User fetchUserFromAuthHeader(String authToken) {

        String[] tokenSplit = authToken.split(" ");
        String username = jwtUtils.getUserNameFromJwtToken(tokenSplit[1]);
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent()) {
            User userFetched = user.get();
            return userFetched;
        }
        return null;
    };
}
