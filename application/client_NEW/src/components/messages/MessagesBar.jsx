import React, { Component } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export default class MessagesBar extends Component {
  constructor(props) {
    super(props);

    this.setChatsAnimation = this.setChatsAnimation.bind(this);
    this.setCreateChatAnimation = this.setCreateChatAnimation.bind(this);

    this.onChangeSearch = this.onChangeSearch.bind(this);
    this.onSearch = this.onSearch.bind(this);

    this.setCreateChat = this.setCreateChat.bind(this);
    this.addChat = this.addChat.bind(this);

    this.state = {
      searchValue: "",
      chatsAnimation: false,
      createChatAnimation: false,
    };
  }

  setChatsAnimation(value) {
    this.setState({
      chatsAnimation: value,
    });
  }

  setCreateChatAnimation(value) {
    this.setState({
      createChatAnimation: value,
    });
  }

  onChangeSearch(e) {
    this.setState({
      searchValue: e.target.value,
    });
  }

  onSearch(id) {
    this.props.history.push("/messages/" + id);
  }

  setCreateChat(value) {
    this.setState({
      createChatAnimation: value,
    });
  }

  addChat() {
    this.setCreateChat(false);
    this.props.history.push("/messages/create");
  }

  render() {
    return (
      <div className="messages-bar">
        <ul className="messages-bar-ul">
          <li className="messages-bar-search">
            <input
              placeholder="Search for Chats by Name"
              value={this.state.searchValue}
              onChange={this.onChangeSearch}
            />
            <SearchResults messagesBar={this} />
          </li>
          <li
            className="messages-bar-button"
            onClick={() => this.setCreateChatAnimation(true)}
          >
            <FontAwesomeIcon
              icon={faPlus}
              size="2x"
              style={{ width: "1.25em" }}
              className={
                this.state.createChatAnimation
                  ? "messages-bar-button-animation"
                  : ""
              }
              onAnimationEnd={this.addChat}
            />
          </li>
        </ul>
      </div>
    );
  }
}

export const SearchResults = (props) => {
  var chats = props.messagesBar.props.chatListData;
  var chatsCount = 0;
  return (
    <ul className="messages-bar-search-results">
      {chats.length === 0
        ? null
        : chats.map((chat, index) => {
            if (
              chat.name.includes(props.messagesBar.state.searchValue) &&
              chatsCount < 6
            ) {
              chatsCount += 1;
              return (
                <li
                  key={chat.chat_id}
                  onClick={() => props.messagesBar.onSearch(chat.chat_id)}
                >
                  <p>{chat.name}</p>
                </li>
              );
            }
            return null;
          })}
      {chatsCount === 0 ? <p>No Results</p> : null}
    </ul>
  );
};
