import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Stomp from "stompjs";

import { ChatList } from "../messages/ChatList.jsx";
import { ChatContainer } from "../messages/ChatContainer.jsx";

function ChatPage() {
  const location = useLocation();
  const chat_id = location.pathname.split("/")[2];
  const [chatsRequests, updateChatsRequests] = useState(false);
  const [messagesRequests, updateMessagesRequests] = useState(false);

  var webSocket = Stomp.over(
    new WebSocket("ws://localhost:8080/websocket-messages")
  );
  webSocket.debug = null;
  webSocket.connect({}, onConnected, onError);

  function onConnected(frame) {
    webSocket.subscribe("/topic/messages", function (message) {
      updateChatsRequests(true);
      updateMessagesRequests(true);
    });
  }

  function onError(error) {
    console.log("STOMP error " + error);
  }

  return (
    <div className="messages-page">
      <div className="messages-container container chat-page">
        <ChatList
          chat_id={chat_id}
          chatsRequests={chatsRequests}
          updateChatsRequests={updateChatsRequests}
        />
        <ChatContainer
          chat_id={chat_id}
          webSocket={webSocket}
          messagesRequests={messagesRequests}
          updateMessagesRequests={updateMessagesRequests}
        />
      </div>
    </div>
  );
}

export default ChatPage;
