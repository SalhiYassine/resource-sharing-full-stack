import React, { Component, useState, useContext, useEffect } from "react";
import axios from "axios";
import TextareaAutosize from "react-textarea-autosize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookReader,
  faPencilAlt,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

import EditMessage from "./EditMessage.jsx";

import { AuthContext } from "../../Context/AuthContext";
import authHeader from "../../Services/authHeader";

export default class MessageContainer extends Component {
  constructor(props) {
    super(props);

    this.setIsEditing = this.setIsEditing.bind(this);
    this.setFinishEdit = this.setFinishEdit.bind(this);

    this.state = {
      isEditing: false,
      finishEdit: false,
    };
  }

  setIsEditing(input) {
    this.setState({ isEditing: input });
  }

  setFinishEdit(input) {
    this.setState({ finishEdit: input });
  }

  render() {
    return (
      <Message
        message={this.props.message}
        messages={this.props.messages}
        index={this.props.index}
        isEditing={this.state.isEditing}
        setIsEditing={this.setIsEditing}
        finishEdit={this.state.finishEdit}
        setFinishEdit={this.setFinishEdit}
        webSocket={this.props.webSocket}
      />
    );
  }
}

export const Message = (props) => {
  const { user } = useContext(AuthContext);
  const message = props.message;
  const messages = props.messages;
  const index = props.index;
  const [profilePictureData, updateProfilePictureData] = React.useState(null);
  const [messageImageData, updateMessageImageData] = React.useState(null);
  const [beginEdit, setBeginEdit] = useState(false);
  const [readBy, updateReadBy] = useState(null);
  const [showReadBy, updateShowReadBy] = useState(false);

  useEffect(() => {
    if (message.user.profile != null) {
      axios({
        method: "get",
        url:
          "http://localhost:8080/profile-picture/" +
          message.user.profile.profile_id,
        responseType: "blob",
        headers: authHeader(),
      }).then((res) => {
        updateProfilePictureData(res.data);
      });
    }
    if (message.messageImage !== null && message.messageImage !== undefined) {
      axios({
        method: "get",
        url:
          "http://localhost:8080/message-image/" +
          message.messageImage.message_image_id,
        responseType: "blob",
        headers: authHeader(),
      }).then((res) => {
        updateMessageImageData(res.data);
      });
    } else {
      updateMessageImageData(null);
    }
    axios({
      method: "get",
      url: "http://localhost:8080/message-read-by/" + message.message_id,
      headers: authHeader(),
    }).then((res) => {
      updateReadBy(res.data);
      if (!res.data.includes(user.userID) && message.user.id !== user.userID) {
        axios({
          method: "put",
          url:
            "http://localhost:8080/message-add-read-by/" +
            message.message_id +
            "/" +
            user.userID,
          headers: authHeader(),
        }).then(() => {
          axios({
            method: "get",
            url: "http://localhost:8080/message-read-by/" + message.message_id,
            headers: authHeader(),
          }).then((res) => {
            updateReadBy(res.data);
          });
        });
      }
    });
  }, [props.message]);

  const onReadBy = () => {
    if (readBy !== null && !showReadBy) updateShowReadBy(true);
    if (showReadBy) updateShowReadBy(false);
  };

  const onEdit = () => {
    setBeginEdit({ beginEdit: true });
  };

  const onDelete = () => {
    axios({
      method: "delete",
      url: "http://www.localhost:8080/delete-message/" + message.message_id,
      headers: authHeader(),
    });

    props.webSocket.send("/app/update-messages-ws", {}, "Update");
  };

  const onAnimationEnd = () => {
    if (beginEdit.beginEdit) {
      setBeginEdit({ beginEdit: false });
      props.setIsEditing(true);
    }
  };

  return (
    <div
      className={messageClassName(beginEdit, props.finishEdit)}
      onAnimationEnd={onAnimationEnd}
    >
      <ul
        className={
          message.user.id === user.userID
            ? "messages-message messages-message-self"
            : "messages-message messages-message-other"
        }
      >
        {message.user.id === user.userID && !props.isEditing ? (
          <li className="messages-message-options">
            <FontAwesomeIcon icon={faBookReader} size="1x" onClick={onReadBy} />
            {message.message === "" ? null : (
              <FontAwesomeIcon icon={faPencilAlt} size="1x" onClick={onEdit} />
            )}
            <FontAwesomeIcon icon={faTimes} size="1x" onClick={onDelete} />
          </li>
        ) : (
          ""
        )}

        {messageImageData !== null ? (
          <li className="messages-message-image">
            <img src={URL.createObjectURL(messageImageData)} />
          </li>
        ) : null}

        {props.isEditing ? (
          <li>
            <EditMessage
              id={index}
              message={message}
              setIsEditing={props.setIsEditing}
              setFinishEdit={props.setFinishEdit}
              webSocket={props.webSocket}
            />
          </li>
        ) : (
          <>
            {message.message === "" ? null : (
              <li className="messages-message-text">
                <TextareaAutosize
                  value={message.message}
                  disabled
                ></TextareaAutosize>
              </li>
            )}
          </>
        )}
        {messages[index + 1] === undefined ||
        message.user.id !== messages[index + 1].user.id ? (
          <li className="messages-message-sender">
            {profilePictureData === null ? (
              <svg height="40" width="40">
                <circle cx="20" cy="20" r="20" />
              </svg>
            ) : (
              <img src={URL.createObjectURL(profilePictureData)} />
            )}
            {message.user.id === user.userID ? null : (
              <ul>
                <li>{message.user.profile.nickname}</li>
                <li>{message.user.username}</li>
              </ul>
            )}
          </li>
        ) : (
          ""
        )}

        {showReadBy ? (
          <div className="messages-message-read-by-container">
            <>
              <p>Read By</p>
              {readBy.length === 0 ? <p>...</p> : null}
              <ul>
                {readBy.map((student, index) => (
                  <li className="messages-message-read-by" key={index}>
                    <p>{student.profile.nickname}</p>
                    <p>{student.username}</p>
                  </li>
                ))}
              </ul>
            </>
          </div>
        ) : null}
      </ul>
    </div>
  );
};

function messageClassName(beginEdit, finishEdit) {
  if (beginEdit.beginEdit) {
    return "messages-message-container messages-message-container-begin-edit-animation";
  } else if (finishEdit) {
    return "messages-message-container messages-message-container-finish-edit-animation";
  } else {
    return "messages-message-container";
  }
}
