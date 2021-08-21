import React, { Component } from "react";
import axios from "axios";
import moment from "moment";
import TextareaAutosize from "react-textarea-autosize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faImages,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import authHeader from "../../Services/authHeader";

import MessageContainer from "./MessageContainer.jsx";

export default class Chat extends Component {
  constructor(props) {
    super(props);

    this.textarea = React.createRef();
    this.onChangeMessageImage = this.onChangeMessageImage.bind(this);
    this.onRemoveMessageImage = this.onRemoveMessageImage.bind(this);
    this.onChangeMessage = this.onChangeMessage.bind(this);
    this.onResizeTextArea = this.onResizeTextArea.bind(this);
    this.onSendMessage = this.onSendMessage.bind(this);
    this.onSendMessageAnimationEnd = this.onSendMessageAnimationEnd.bind(this);

    this.state = {
      message: "",
      messageImage: null,
      messagesHeight: 42,
      messageImageHeight: 0,
      sendMessageAnimation: false,
      fileInput: null,
      invalidData: {
        image: "",
      },
    };
  }

  onComponentUpdate() {
    this.setOpenChatAnimation(true);
  }

  onChangeMessageImage(e) {
    e.preventDefault();

    if (e.target.files.length === 0) {
      this.setState({
        messageImage: null,
        messageImageHeight: 0,
        invalidData: { image: "" },
      });
    } else {
      this.setState({
        messageImage: e.target.files[0],
        messageImageHeight: 209,
        fileInput: e.target,
        invalidData: { image: "" },
      });
    }
  }

  onRemoveMessageImage(e) {
    this.setState({
      messageImage: null,
      messageImageHeight: 0,
    });
    this.state.fileInput.value = null;
  }

  onChangeMessage(e) {
    this.setState({
      message: e.target.value,
    });
  }

  onResizeTextArea(height) {
    this.setState({
      messagesHeight: height,
    });
  }

  onSendMessage(e) {
    e.preventDefault();

    this.setState({
      sendMessageAnimation: true,
    });

    if (this.state.message !== "" || this.state.messageImage !== null) {
      const message = {
        message: this.state.message,
        date: moment().format("YYYY-MM-DD HH:mm:ss"),
        chat_id: this.props.chat.chat_id,
        user_id: this.props.user.userID,
      };
      const token = JSON.parse(localStorage.getItem("token"));

      const header = {
        Authorization: "Bearer " + token,
        "Access-Control-Allow-Origin": "*",
      };

      var types = ["image/png", "image/jpg", "image/jpeg", "image/x-icon"];

      if (
        this.state.messageImage === null ||
        (this.state.messageImage.size <= 500000 &&
          types.includes(this.state.messageImage.type))
      ) {
        axios({
          method: "post",
          url: "http://localhost:8080/add-message",
          headers: header,
          data: message,
        }).then((res) => {
          if (this.state.messageImage !== null) {
            const messageImage = new FormData();
            messageImage.append("image", this.state.messageImage);
            messageImage.append("chat_id", this.props.chat.chat_id);

            const header = {
              Authorization:
                "Bearer " + JSON.parse(localStorage.getItem("token")),
              "Content-Type": "multipart/form-data",
            };

            axios({
              method: "post",
              url:
                "http://localhost:8080/add-message-image/" +
                res.data.message_id,
              headers: header,
              data: messageImage,
            }).then(() => {
              this.setState({
                message: "",
                messageImage: null,
                messageImageHeight: 0,
              });
              this.state.fileInput.value = null;
            });
          } else {
            this.setState({
              message: "",
              messageImage: null,
              messageImageHeight: 0,
            });
          }
        });

        const chat = {
          chat_id: this.props.chat.chat_id,
          date_updated: moment().format("YYYY-MM-DD HH:mm:ss"),
        };

        axios({
          method: "put",
          url: "http://localhost:8080/update-chat-date",
          headers: authHeader(),
          data: chat,
        });

        this.props.webSocket.send("/app/update-messages-ws", {}, "Update");
      } else {
        this.setState({
          invalidData: {
            image:
              this.state.messageImage.size > 500000
                ? "tooLarge"
                : "invalidType",
          },
          messageImageHeight: 250,
        });
      }
    }
  }

  onSendMessageAnimationEnd(e) {
    this.setState({
      sendMessageAnimation: false,
    });
  }

  render() {
    return (
      <>
        <div
          className="messages-messages-container"
          style={{
            height:
              "calc(85vh - 113px - " +
              this.state.messagesHeight +
              "px - " +
              this.state.messageImageHeight +
              "px )",
          }}
          key={this.props.chat._id}
        >
          <br />
          {this.props.messages.length === 0 ? (
            <p>There are no messages in this chat yet.</p>
          ) : null}
          {this.props.messages.map((message, j) => {
            return (
              <MessageContainer
                message={message}
                messages={this.props.messages}
                index={j}
                key={j}
                webSocket={this.props.webSocket}
              />
            );
          })}
        </div>
        {this.state.messageImage === null ? null : (
          <div className="messages-messages-image-preview-container">
            <div className="messages-messages-image-preview-remove-container">
              <div
                className="messages-messages-image-preview-remove-button"
                onClick={this.onRemoveMessageImage}
              >
                <FontAwesomeIcon icon={faTimes} size="2x" />
              </div>
            </div>
            <img src={URL.createObjectURL(this.state.messageImage)} />
            {this.state.invalidData.image === "invalidType" ? (
              <p className="invalid-indicator-text">* Invalid File Type.</p>
            ) : null}
            {this.state.invalidData.image === "tooLarge" ? (
              <p className="invalid-indicator-text">* Too Large.</p>
            ) : null}
          </div>
        )}
        <div className="messages-messages-send-container">
          <label
            className="messages-messages-send-image-container"
            id="sendMessageImageLabel"
            htmlFor="sendMessageImageFileInput"
          >
            <div className="messages-messages-send-image-button">
              <FontAwesomeIcon icon={faImages} size="2x" />
            </div>
            <input
              type="file"
              id="sendMessageImageFileInput"
              onChange={this.onChangeMessageImage}
              accept="image/png, image/jpg, image/jpeg, image/x-icon"
            ></input>
          </label>

          <TextareaAutosize
            placeholder="Enter Message"
            type="text"
            id="message"
            ref={this.textarea}
            value={this.state.message}
            onChange={this.onChangeMessage}
            onHeightChange={this.onResizeTextArea}
          />

          <button
            className={
              this.state.sendMessageAnimation
                ? "messages-messages-send-button messages-messages-send-button-animation"
                : "messages-messages-send-button"
            }
            onClick={this.onSendMessage}
            onAnimationEnd={this.onSendMessageAnimationEnd}
          >
            <FontAwesomeIcon icon={faPaperPlane} size="2x" />
          </button>
        </div>
      </>
    );
  }
}
