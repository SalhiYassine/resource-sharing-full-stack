import React, { Component, useEffect, useContext } from "react";
import axios from "axios";
import moment from "moment";
import TextareaAutosize from "react-textarea-autosize";
import * as fa from "react-icons/fa";

import { AuthContext } from "../../Context/AuthContext";
import authHeader from "../../Services/authHeader";

export default class EditChat extends Component {
  constructor(props) {
    super(props);

    this.exitEdit = this.exitEdit.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeChatIconFile = this.onChangeChatIconFile.bind(this);
    this.onChangeParticipant = this.onChangeParticipant.bind(this);
    this.setParticipant = this.setParticipant.bind(this);
    this.onPariticipantSubmit = this.onPariticipantSubmit.bind(this);

    this.setAddParticipantButtonAnimation = this.setAddParticipantButtonAnimation.bind(
      this
    );
    this.setDeleteChatButtonAnimation = this.setDeleteChatButtonAnimation.bind(
      this
    );
    this.setEditChatButtonAnimation = this.setEditChatButtonAnimation.bind(
      this
    );

    this.onDelete = this.onDelete.bind(this);
    this.onNoConfirmDelete = this.onNoConfirmDelete.bind(this);
    this.onConfirmDelete = this.onConfirmDelete.bind(this);
    this.onPariticipantSubmit = this.onPariticipantSubmit.bind(this);
    this.authHeader = this.authHeader.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      name: props.chat.name,
      picture: null,
      participantsList: props.participantsList,
      participant: "",
      confirmDelete: false,
      addParticipantButtonAnimation: false,
      deleteChatButtonAnimation: false,
      editChatButtonAnimation: false,
      invalidData: {
        name: false,
        picture: false,
        participants: false,
      },
    };
  }

  exitEdit() {
    this.props.history.push("/messages/" + this.props.chat_id);
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

  setDeleteChatButtonAnimation(value) {
    this.setState({
      deleteChatButtonAnimation: value,
    });
  }

  onDelete() {
    this.setState({
      deleteChatButtonAnimation: false,
      confirmDelete: true,
    });
  }

  onNoConfirmDelete() {
    this.setState({
      confirmDelete: false,
    });
  }

  onConfirmDelete() {
    this.setState({
      confirmDelete: false,
    });

    axios({
      method: "put",
      url: "http://localhost:8080/delete-chat/" + this.props.chat.chat_id,
      headers: authHeader(),
    }).then(() => {
      this.props.history.push("/messages");
      this.props.webSocket.send("/app/update-messages-ws", {}, "Update");
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

    const chat = new FormData();
    var types = ["image/png", "image/jpg", "image/jpeg", "image/x-icon"];
    var picture = this.props.chatPicture;
    if (this.state.picture !== null) {
      picture =
        this.state.picture.size > 500000 ||
        !types.includes(this.state.picture.type)
          ? null
          : this.state.picture;
    }

    if (this.state.picture === null || this.state.picture.size <= 500000) {
      this.setState({
        invalidData: {
          name: this.state.name === "" ? true : false,
          picture: picture === null ? true : false,
          participants: this.state.participantsList.length === 0 ? true : false,
        },
      });
    } else {
      this.setState({
        invalidData: {
          name: this.state.name === "" ? true : false,
          picture: "tooLarge",
          participants: this.state.participantsList.length === 0 ? true : false,
        },
      });
    }

    if (
      (this.state.name !== "" || null) &&
      picture !== null &&
      this.state.participantsList.length !== 0
    ) {
      chat.append("chat_id", this.props.chat.chat_id);
      chat.append("name", this.state.name);
      chat.append("date_updated", moment().format("YYYY-MM-DD HH:mm:ss"));
      chat.append("picture", picture);
      axios({
        method: "put",
        url: "http://www.localhost:8080/edit-chat",
        data: chat,
        headers: this.authHeader(),
      });

      // Add Students to Chat
      for (let i = 0; i < this.state.participantsList.length; i++) {
        if (
          !this.props.participantsList.includes(this.state.participantsList[i])
        ) {
          axios({
            method: "put",
            url:
              "http://www.localhost:8080/add-user-to-chat/" +
              this.props.chat.chat_id +
              "/" +
              this.state.participantsList[i],
            headers: authHeader(),
          });
        }
      }

      // Remove Students from Chat
      for (let i = 0; i < this.props.participantsList.length; i++) {
        if (
          !this.state.participantsList.includes(this.props.participantsList[i])
        ) {
          axios({
            method: "put",
            url:
              "http://www.localhost:8080/remove-user-from-chat/" +
              this.props.chat.chat_id +
              "/" +
              this.props.participantsList[i],
            headers: authHeader(),
          });
        }
      }

      this.props.history.push("/messages/" + this.props.chat.chat_id);
    }

    this.props.webSocket.send("/app/update-messages-ws", {}, "Update");

    this.setState({ editChatButtonAnimation: false });
  }

  render() {
    return (
      <div className="messages-edit-chat-container">
        <div className="messages-chat-bar-back" onClick={this.exitEdit}>
          <fa.FaAngleLeft />
        </div>
        <div className="messages-edit-chat-title">
          <fa.FaEdit className="nav-icons" />
          <h1>Edit Chat</h1>
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
            {this.state.picture === null && this.props.chatPicture === null ? (
              <svg height="70" width="70">
                <circle cx="35" cy="35" r="35" />
              </svg>
            ) : (
              <img
                src={
                  this.state.picture === null
                    ? URL.createObjectURL(this.props.chatPicture)
                    : URL.createObjectURL(this.state.picture)
                }
              />
            )}
            <input
              type="file"
              id="chatPictureFileInput"
              onChange={this.onChangeChatIconFile}
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
          <p>* Participants</p>
          <div className="form-participants">
            {this.state.participantsList.length === 0 ? (
              <p className="invalid-indicator-text">
                * Please keep at least one participant.
              </p>
            ) : null}
            {this.state.participantsList.map((participant, index) => {
              return (
                <Participant
                  participant={participant}
                  index={index}
                  editChat={this}
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
            <SearchResults editChat={this} />
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
        {this.state.confirmDelete === false ? (
          <div className="form-submit-container">
            <button
              className="iconButton"
              onClick={() => this.setEditChatButtonAnimation(true)}
            >
              <fa.FaSave
                className={
                  this.state.editChatButtonAnimation
                    ? " messages-edit-chat-edit-animation"
                    : ""
                }
                onAnimationEnd={this.onSubmit}
              />
            </button>
            <button
              onClick={() => this.setDeleteChatButtonAnimation(true)}
              className={
                this.state.deleteChatButtonAnimation
                  ? "iconButton messages-edit-chat-delete-animation"
                  : "iconButton"
              }
              onAnimationEnd={this.onDelete}
            >
              <fa.FaTrash />
            </button>
          </div>
        ) : (
          <>
            <div className="form-submit-confirm-delete-container">
              <h1>Delete Chat</h1>
              <p>Are you sure you want to delete this chat?</p>
              <button onClick={this.onConfirmDelete}>Yes</button>
              <button onClick={this.onNoConfirmDelete}>No</button>
            </div>
          </>
        )}
        <br />
        <br />
        <br />
      </div>
    );
  }
}

export const Participant = (props) => {
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
          <li className="form-participant-options">
            <fa.FaTimes
              onClick={() => props.editChat.removeParticipant(props.index)}
            />
          </li>
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
  var colleagues = props.editChat.props.colleagues;
  var colleaguesCount = 0;
  return (
    <ul className="participants-search-results">
      {colleagues.length === 0
        ? null
        : colleagues.map((colleague, index) => {
            if (
              colleague.username.includes(props.editChat.state.participant) &&
              colleaguesCount < 6 &&
              colleague.profile !== null &&
              !props.editChat.state.participantsList.includes(colleague.id)
            ) {
              colleaguesCount += 1;
              return (
                <li
                  key={index}
                  onClick={() =>
                    props.editChat.setParticipant(colleague.username)
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
