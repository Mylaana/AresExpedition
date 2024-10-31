package com.ares_expedition.stomp_websocket.draw;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import com.ares_expedition.database.GameController;

@Controller
public class WsDrawController {
    
    @MessageMapping("/draw")
    @SendTo("/topic/drawresult")
    public DrawResult drawCards(DrawQuery message) throws Exception {
        return new DrawResult(GameController.drawCards(1, message.getDrawNumber()));
    }
}
