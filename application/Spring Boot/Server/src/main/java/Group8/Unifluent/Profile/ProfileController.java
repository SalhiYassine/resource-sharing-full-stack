package Group8.Unifluent.Profile;

import javax.persistence.*;
import java.io.*;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.Optional;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.hibernate.*;

@RestController
public class ProfileController {

    @Autowired
    ProfileRepository profileRepository;

    @Autowired
    private EntityManagerFactory entityManagerFactory;

    @CrossOrigin
    @RequestMapping(value = "/profile-picture/{id}", method=RequestMethod.GET, produces = MediaType.IMAGE_PNG_VALUE)
    public @ResponseBody byte[] profilePicture(@PathVariable(value = "id") long profile_id) throws SQLException {
        Blob picture = profileRepository.findByProfileId(profile_id).getPicture();
        return picture.getBytes(1, (int) picture.length());
    }

    @CrossOrigin
    @PostMapping("/add-profile")
    public void addProfile(@ModelAttribute MultipartFileProfile multipartFileProfile) throws IOException {
        InputStream multipartFilePicture = multipartFileProfile.getPicture().getInputStream();
        Session session = (Session) entityManagerFactory.createEntityManager().getDelegate();
        Blob picture = Hibernate.getLobCreator(session).createBlob(multipartFilePicture, multipartFileProfile.getPicture().getSize());

        Profile profile = new Profile();
        profile.setNickname(multipartFileProfile.getNickname());
        profile.setIs_private(multipartFileProfile.getIs_private());
        profile.setCourse(multipartFileProfile.getCourse());
        profile.setStrongest_subject(multipartFileProfile.getStrongest_subject());
        profile.setDescription(multipartFileProfile.getDescription());
        profile.setPicture(picture);
        profile.setUser(multipartFileProfile.getUser());
        multipartFileProfile.getUser().setProfile(profile);
        profileRepository.save(profile);
    }

    @CrossOrigin
    @PutMapping("/edit-profile")
    public void editProfile(@ModelAttribute MultipartFileProfile multipartFileProfile) throws IOException {
        InputStream multipartFilePicture = multipartFileProfile.getPicture().getInputStream();
        Session session = (Session) entityManagerFactory.createEntityManager().getDelegate();
        Blob picture = Hibernate.getLobCreator(session).createBlob(multipartFilePicture, multipartFileProfile.getPicture().getSize());

        Profile profile = new Profile();
        profile.setProfile_id(multipartFileProfile.getProfile_id());
        profile.setNickname(multipartFileProfile.getNickname());
        profile.setIs_private(multipartFileProfile.getIs_private());
        profile.setCourse(multipartFileProfile.getCourse());
        profile.setStrongest_subject(multipartFileProfile.getStrongest_subject());
        profile.setDescription(multipartFileProfile.getDescription());
        profile.setPicture(picture);
        profile.setUser(multipartFileProfile.getUser());
        profileRepository.save(profile);
    }
}

