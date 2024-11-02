package com.ares_expedition.stomp_websocket;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class WsController {
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public WsController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/player")
    public void resolvePlayerQuery(PlayerMessageQuery message) throws Exception {
        sendPushToPlayer(1, 0, new PlayerMessageAnswer("answer"));
    }

    public void sendPushToPlayer(Integer gameId, Integer playerId, PlayerMessageAnswer message){
        String wsUrl = String.format("/topic/player/%d/%d", gameId, playerId);
        messagingTemplate.convertAndSend(wsUrl, message);
    }

    public void sendPushToGroup(Integer gameId, PlayerMessageAnswer message){
        String wsUrl = String.format("/topic/group/%d", gameId);
        messagingTemplate.convertAndSend(wsUrl, message);
    }
}
