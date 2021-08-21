import React, { Component, useEffect, useContext } from "react";
import axios from "axios";
import moment from "moment";
import TextareaAutosize from "react-textarea-autosize";
import * as fa from "react-icons/fa";

import { AuthContext } from "../../Context/AuthContext";
import authHeader from "../../Services/authHeader";

import defaultChatIcon from "../../assets/defaultChatIcon.png";

export default class CreateChat extends Component {
  constructor(props) {
    super(props);

    this.exitCreate = this.exitCreate.bind(this);

    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeChatIconFile = this.onChangeChatIconFile.bind(this);
    this.onChangeParticipant = this.onChangeParticipant.bind(this);

    this.setParticipant = this.setParticipant.bind(this);
    this.onPariticipantSubmit = this.onPariticipantSubmit.bind(this);
    this.removeParticipant = this.removeParticipant.bind(this);
    this.setAddParticipantButtonAnimation = this.setAddParticipantButtonAnimation.bind(
      this
    );

    this.setEditChatButtonAnimation = this.setEditChatButtonAnimation.bind(
      this
    );
    this.authHeader = this.authHeader.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      name: "",
      picture: null,
      participantsList: [this.props.user.id],
      participant: "",
      addParticipantButtonAnimation: false,
      addChatButtonAnimation: false,
      invalidData: {
        name: false,
        picture: false,
      },
    };
  }

  exitCreate() {
    this.props.history.push("/messages");
  }

  onChangeName(e) {
    this.setState({
      name: e.target.value,
    });
  }

  onChangeChatIconFile(e) {
    if (e.target.files.length === 0) {
      this.setState({
        picture: null,
      });
    } else {
      this.setState({
        picture: e.target.files[0],
      });
    }
  }

  onChangeParticipant(e) {
    this.setState({
      participant: e.target.value,
    });
  }

  setParticipant(username) {
    this.setState({
      participant: username,
    });
  }

  onPariticipantSubmit(e) {
    e.preventDefault();

    this.setAddParticipantButtonAnimation(false);

    axios({
      method: "get",
      url: "http://localhost:8080/user-by-username/" + this.state.participant,
      headers: authHeader(),
    }).then((res) => {
      if (
        res.data !== null &&
        !this.state.participantsList.includes(res.data.id)
      ) {
        var participantsArray = [...this.state.participantsList];
        participantsArray.push(res.data.id);
        this.setState({
          participantsList: participantsArray,
          participant: "",
        });
      }
    });
  }

  removeParticipant(index) {
    var participantsArray = [...this.state.participantsList];
    participantsArray.splice(index, 1);
    this.setState({
      participantsList: participantsArray,
    });
  }

  setAddParticipantButtonAnimation(value) {
    this.setState({
      addParticipantButtonAnimation: value,
    });
  }

  setEditChatButtonAnimation(value) {
    this.setState({
      editChatButtonAnimation: value,
    });
  }

  authHeader() {
    const token = JSON.parse(localStorage.getItem("token"));
    if (token) {
      return {
        Authorization: "Bearer " + token,
        "Content-Type": "multipart/form-data",
      };
    } else {
      return {};
    }
  }

  onSubmit(e) {
    e.preventDefault();

    var types = ["image/png", "image/jpg", "image/jpeg", "image/x-icon"];
    var picture =
      this.state.picture === null ||
      this.state.picture.size > 500000 ||
      !types.includes(this.state.picture.type)
        ? null
        : this.state.picture;

    if (this.state.picture === null || this.state.picture.size <= 500000) {
      this.setState({
        invalidData: {
          name: this.state.name === "" ? true : false,
          picture: picture === null ? true : false,
        },
      });
    } else {
      this.setState({
        invalidData: {
          name: this.state.name === "" ? true : false,
          picture: "tooLarge",
        },
      });
    }

    if (
      (this.state.name !== "" || null) &&
      picture !== null &&
      this.state.participantsList !== []
    ) {
      const chat = new FormData();
      chat.append("name", this.state.name);
      chat.append("date_updated", moment().format("YYYY-MM-DD HH:mm:ss"));
      chat.append("picture", picture);
      chat.append("users", this.state.participantsList);

      axios({
        method: "post",
        url: "http://www.localhost:8080/add-chat",
        data: chat,
        headers: this.authHeader(),
      }).then(() => {
        this.props.webSocket.send("/app/update-messages-ws", {}, "Update");
      });

      this.setState({
        name: "",
        picture: null,
        participantsList: [],
        participant: "",
        editChatButtonAnimation: false,
      });

      this.props.history.push("/messages");
    }

    this.setState({ editChatButtonAnimation: false });
  }

  render() {
    return (
      <div className="messages-edit-chat-container">
        <div className="messages-chat-bar-back" onClick={this.exitCreate}>
          <fa.FaAngleLeft />
        </div>
        <div className="messages-edit-chat-title">
          <fa.FaPlus className="nav-icons" />
          <h1>Add Chat</h1>
        </div>
        <div className="form-input-container form-text-input-container">
          <p>* Chat Name</p>
          <TextareaAutosize
            placeholder={"Add a name for the chat"}
            value={this.state.name}
            onChange={this.onChangeName}
          />
          {this.state.invalidData.name ? (
            <p className="invalid-indicator-text">
              * Please enter a name for this chat.
            </p>
          ) : null}
        </div>
        <div className="form-input-container form-file-input-container edit-profile-input-container edit-profile-file-input-container">
          <p>* Chat Icon</p>
          <label id="chatPictureFileLabel" htmlFor="chatPictureFileInput">
            <img
              src={
                this.state.picture === null
                  ? defaultChatIcon
                  : URL.createObjectURL(this.state.picture)
              }
            />
            <input
              type="file"
              id="chatPictureFileInput"
              onChange={this.onChangeChatIconFile}
              accept="image/png, image/jpg, image/jpeg, image/x-icon"
            ></input>
          </label>
          {this.state.invalidData.picture === true ? (
            <p className="invalid-indicator-text">
              * Please add a suitable picture for this chat's icon.
            </p>
          ) : null}
          {this.state.invalidData.picture === "tooLarge" ? (
            <p className="invalid-indicator-text">
              * Image too large. Please add a suitable picture for this chat's
              icon.
            </p>
          ) : null}
        </div>
        <div className="form-input-container form-participants-container">
          <p>Participants</p>
          <div className="form-participants">
            {this.state.participantsList.length === 0 ? (
              <p>No Participants</p>
            ) : null}
            {this.state.participantsList.map((participant, index) => {
              return (
                <Participant
                  participant={participant}
                  index={index}
                  createChat={this}
                  key={participant}
                />
              );
            })}
          </div>
          <div className="form-participants-input">
            <input
              value={this.state.participant}
              onChange={this.onChangeParticipant}
              placeholder="Search for Students by Username"
            ></input>
            <SearchResults createChat={this} />
            <button
              onClick={
                this.state.participant !== ""
                  ? () => this.setAddParticipantButtonAnimation(true)
                  : null
              }
            >
              <fa.FaPlus
                className={
                  this.state.addParticipantButtonAnimation
                    ? " messages-bar-button-animation"
                    : ""
                }
                onAnimationEnd={this.onPariticipantSubmit}
              />
            </button>
          </div>
        </div>
        <div className="form-submit-container">
          <button
            className="iconButton"
            onClick={() => this.setEditChatButtonAnimation(true)}
          >
            <fa.FaPlus
              className={
                this.state.editChatButtonAnimation
                  ? " messages-edit-chat-edit-animation"
                  : ""
              }
              onAnimationEnd={this.onSubmit}
            />
          </button>
        </div>
        <br />
        <br />
        <br />
      </div>
    );
  }
}

export const Participant = (props) => {
  const { user } = useContext(AuthContext);
  const [userData, updateUserData] = React.useState(null);
  const [profilePictureData, updateProfilePictureData] = React.useState(null);

  useEffect(() => {
    axios({
      method: "get",
      url: "http://localhost:8080/user/" + props.participant,
      headers: authHeader(),
    }).then((res) => {
      updateUserData(res.data);
    });
  }, []);

  useEffect(() => {
    if (userData != null) {
      axios({
        method: "get",
        url:
          "http://localhost:8080/profile-picture/" +
          userData.profile.profile_id,
        responseType: "blob",
        headers: authHeader(),
      }).then((res) => {
        updateProfilePictureData(res.data);
      });
    }
  }, [userData]);

  return (
    <>
      {userData !== null && profilePictureData !== null ? (
        <div className="form-participant-container">
          {userData.id === user.userID ? null : (
            <li className="form-participant-options">
              <fa.FaTimes
                onClick={() => props.createChat.removeParticipant(props.index)}
              />
            </li>
          )}
          {profilePictureData === null ? (
            <svg height="50" width="50">
              <circle cx="25" cy="25" r="25" />
            </svg>
          ) : (
            <img src={URL.createObjectURL(profilePictureData)} />
          )}
          <ul>
            <li>{userData.profile.nickname}</li>
            <li>{userData.username}</li>
          </ul>
        </div>
      ) : null}
    </>
  );
};

export const SearchResults = (props) => {
  const { user } = useContext(AuthContext);
  var colleagues = props.createChat.props.colleagues;
  var colleaguesCount = 0;
  return (
    <ul className="participants-search-results">
      {colleagues.length === 0
        ? null
        : colleagues.map((colleague, index) => {
            if (
              colleague.username.includes(props.createChat.state.participant) &&
              colleaguesCount < 6 &&
              colleague.profile !== null &&
              !props.createChat.state.participantsList.includes(colleague.id)
            ) {
              colleaguesCount += 1;
              return (
                <li
                  key={index}
                  onClick={() =>
                    props.createChat.setParticipant(colleague.username)
                  }
                >
                  <p>{colleague.profile.nickname}</p>
                  <p>{colleague.username}</p>
                </li>
              );
            }
            return null;
          })}
      {colleaguesCount === 0 ? <p>No Results</p> : null}
    </ul>
  );
};
