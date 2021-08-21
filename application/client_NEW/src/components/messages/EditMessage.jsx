import React, { Component } from "react";
import axios from "axios";
import TextareaAutosize from "react-textarea-autosize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";

import authHeader from "../../Services/authHeader";

export default class EditMessage extends Component {
  constructor(props) {
    super(props);

    this.onChangeText = this.onChangeText.bind(this);
    this.onEditAnimationEnd = this.onEditAnimationEnd.bind(this);
    this.onFinishEdit = this.onFinishEdit.bind(this);

    this.state = {
      text: props.message.message,
      onEditAnimation: true,
      onFinishEditAnimation: false,
      finishEdit: false,
    };
  }

  componentDidUpdate() {
    if (this.state.finishEdit) {
      this.props.setFinishEdit(true);
      this.props.setIsEditing(false);
    }
  }

  onChangeText(e) {
    this.setState({
      text: e.target.value,
    });
  }

  onEditAnimationEnd(e) {
    if (this.state.onFinishEditAnimation) {
      this.setState({
        finishEdit: true,
      });
    }
    this.setState({
      onEditAnimation: false,
      onFinishEditAnimation: false,
    });
  }

  onFinishEdit(e) {
    const message = {
      message_id: this.props.message.message_id,
      message: this.state.text,
    };

    axios({
      method: "put",
      url: "http://www.localhost:8080/edit-message",
      headers: authHeader(),
      data: message,
    });

    this.props.webSocket.send("/app/update-messages-ws", {}, "Update");

    this.setState({
      onFinishEditAnimation: true,
    });
  }

  render() {
    return (
      <div
        className={editMessageClassName(
          this.state.onEditAnimation,
          this.state.onFinishEditAnimation
        )}
        onAnimationEnd={this.onEditAnimationEnd}
      >
        <TextareaAutosize
          placeholder="Enter Message"
          type="text"
          id="text"
          value={this.state.text}
          onChange={this.onChangeText}
        ></TextareaAutosize>
        <FontAwesomeIcon icon={faSave} size="2x" onClick={this.onFinishEdit} />
      </div>
    );
  }
}

function editMessageClassName(onEditAnimation, onFinishEditAnimation) {
  if (onEditAnimation) {
    return "messages-message-edit-container editMessageAnimation";
  } else if (onFinishEditAnimation) {
    return "messages-message-edit-container onFinishEditAnimation";
  } else {
    return "messages-message-edit-container";
  }
}
