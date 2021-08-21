package Group8.Unifluent.MessagesWebSocket;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class MessagesWebSocketController {

    @MessageMapping("/update-messages-ws")
    @SendTo("/topic/messages")
    public String message(String message){
        return message;
    }
}
