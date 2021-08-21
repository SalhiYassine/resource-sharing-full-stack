package Group8.Unifluent.User;

import Group8.Unifluent.Progress.Progress;
import Group8.Unifluent.Rank.Rank;
import Group8.Unifluent.Resource.Resource;
import Group8.Unifluent.Comment.Comment;
import Group8.Unifluent.Role.Role;
import Group8.Unifluent.Profile.Profile;
import Group8.Unifluent.Chat.Chat;
import Group8.Unifluent.Message.Message;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Entity
@Table(	name = "users", uniqueConstraints = {
			@UniqueConstraint(columnNames = "username"),
			@UniqueConstraint(columnNames = "email") 
		})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class User {
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotBlank @Size(max = 20)
	private String username;

	@NotBlank @Size(max = 50) @Email
	private String email;

	@NotBlank @Size(max = 120)
	private String password;

	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(	name = "user_roles", joinColumns =
	@JoinColumn(name = "user_id"), inverseJoinColumns =
	@JoinColumn(name = "role_id"))
	@JsonIgnore
	private Set<Role> roles = new HashSet<>();

	@OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
	@JoinColumn(name = "profile_id", referencedColumnName = "profile_id")
	private Profile profile;

	@ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	@JoinTable(
			name = "colleagues",
			joinColumns = @JoinColumn(name = "user_id_1"),
			inverseJoinColumns = @JoinColumn(name = "user_id_2")
	)
	@JsonIgnore
	private List<User> colleagues = new ArrayList<>();

	@ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	@JoinTable(
			name = "colleagueRequestsSent",
			joinColumns = @JoinColumn(name = "user_id_1"),
			inverseJoinColumns = @JoinColumn(name = "user_id_2")
	)
	@JsonIgnore
	private List<User> colleagueRequestsSent = new ArrayList<>();

	@ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	@JoinTable(
			name = "colleagueRequestsReceived",
			joinColumns = @JoinColumn(name = "user_id_1"),
			inverseJoinColumns = @JoinColumn(name = "user_id_2")
	)
	@JsonIgnore
	private List<User> colleagueRequestsReceived = new ArrayList<>();

	@OneToMany(mappedBy = "user",
			orphanRemoval = true,
			cascade = CascadeType.ALL)
	@JsonIgnore
	private List<Rank> ranks = new ArrayList<>();

	@OneToMany(mappedBy = "markedBy",
			orphanRemoval = true,
			cascade = CascadeType.ALL)
	@JsonIgnore
	private List<Rank> marks = new ArrayList<>();

	@OneToMany(
			mappedBy = "user",
			orphanRemoval = true,
			cascade = CascadeType.ALL
	)
	@JsonIgnore
	private List<Resource> resources = new ArrayList<>();

	@OneToMany(
			mappedBy = "user",
			orphanRemoval = true,
			cascade = CascadeType.ALL
	)
	@JsonIgnore
	private List<Comment> comments = new ArrayList<>();

	@ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	@JoinTable(
			name = "user_in_chat",
			joinColumns = @JoinColumn(name = "user_id"),
			inverseJoinColumns = @JoinColumn(name = "chat_id")
	)
	@JsonIgnore
	private List<Chat> chats = new ArrayList<>();

	@OneToMany(
			mappedBy = "user",
			orphanRemoval = true,
			cascade = CascadeType.ALL
	)
	@JsonIgnore
	private List<Message> messages = new ArrayList<>();

	@ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL, mappedBy = "readBy")
	@JsonIgnore
	private List<Message> readMessages = new ArrayList<>();

	@OneToMany(
			mappedBy = "user",
			orphanRemoval = true,
			cascade = CascadeType.ALL
	)
	@JsonIgnore
	private List<Progress> progressList = new ArrayList<>();

	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(
			name = "user_saved_resources",
			joinColumns = @JoinColumn(name="user_id"),
			inverseJoinColumns = @JoinColumn(name ="resource_id")
	)
	private Set<Resource> savedResources = new HashSet<Resource>();

	public User(String username, String email, String password) {
		this.username = username;
		this.email = email;
		this.password = password;
	}

	// Colleagues

	public boolean addColleague(User user){
		if(this.colleagueRequestsSent.contains(user)) {
			this.colleagueRequestsSent.remove(user);
		}
		if(this.colleagueRequestsReceived.contains(user)) {
			this.colleagueRequestsReceived.remove(user);
		}
		if(!this.colleagues.contains(user)){
			this.colleagues.add(user);
			return true;
		}
		return false;
	}

	public boolean removeColleague(User user){
		if(this.colleagues.contains(user)){
			this.colleagues.remove(user);
			return true;
		}
		return false;
	}

	public boolean addColleagueRequestSent(User user){
		if(!this.colleagueRequestsSent.contains(user)){
			this.colleagueRequestsSent.add(user);
			return true;
		}
		return false;
	}

	public boolean removeColleagueRequestSent(User user){
		if(this.colleagueRequestsSent.contains(user)){
			this.colleagueRequestsSent.remove(user);
			return true;
		}
		return false;
	}

	public boolean addColleagueRequestReceived(User user){
		if(!this.colleagueRequestsReceived.contains(user)){
			this.colleagueRequestsReceived.add(user);
			return true;
		}
		return false;
	}

	public boolean removeColleagueRequestReceived(User user){
		if(this.colleagueRequestsReceived.contains(user)){
			this.colleagueRequestsReceived.remove(user);
			return true;
		}
		return false;
	}

	// Ranking

	public boolean addRank(Rank rank){
		if(this.ranks.contains(rank)) {
			this.ranks.add(rank);
			return true;
		}
		return false;
	}

	public boolean removeRank(Rank rank){
		if(this.ranks.contains(rank)){
			this.ranks.remove(rank);
			return true;
		}
		return false;
	}

	// Resources

	public boolean addResource(Resource resource){
		if(!resources.contains(resource)){
			resources.add(resource);
			resource.setUser(this);
			return true;
		}
		return false;
	}

	public boolean removeResource(Resource resource){
		if(this.resources.contains(resource)){
			this.resources.remove(resource);
			resource.setUser(null);
			return true;
		}
		return false;
	}

	public boolean addComment(Resource resource, Comment comment){
		if(!comments.contains(comment)){
			comments.add(comment);
			comment.setUser(this);
			comment.setResource(resource);
			return true;
		}
		return false;
	}

	public boolean removeComment(Comment comment){
		if(this.comments.contains(comment)){
			this.comments.remove(comment);
			comment.setUser(null);
			comment.setResource(null);
			return true;
		}
		return false;
	}

	// Messages

	public boolean addChat(Chat chat){
		if(!this.chats.contains(chat)){
			this.chats.add(chat);
			return true;
		}
		return false;
	}

	public boolean removeChat(Chat chat){
		if(this.chats.contains(chat)){
			this.chats.remove(chat);
			return true;
		}
		return false;
	}

	public boolean addMessage(Message message){
		if(!messages.contains(message)){
			this.messages.add(message);
			return true;
		}
		return false;
	}

	public boolean removeMessage(Message message){
		if(messages.contains(message)){
			messages.remove(message);
			return true;
		}
		return false;
	}

	public boolean addReadBy(Message message){
		if(!readMessages.contains(message)){
			readMessages.add(message);
			return true;
		}
		return false;
	}

	public boolean removeReadBy(Message message){
		if(readMessages.contains(message)){
			readMessages.remove(message);
			return true;
		}
		return false;
	}

	// Progress

	public boolean addAssessment(Progress progress) {
		if (!progressList.contains(progress)) {
			progress.setUser(this);
			progressList.add(progress);
			return true;
		}
		return false;
	}
/*
	public boolean removeAccount(User user1){
		if(user1.contains(username)
				&& this.email.contains (email)
				&& this.password.contains(password)) {
			this.setUsername().remove(username);
			this.setEmail().remove(email);
			this.setPassword().remove(password);
			return true;
		}
		return false;
	}
*/

}
