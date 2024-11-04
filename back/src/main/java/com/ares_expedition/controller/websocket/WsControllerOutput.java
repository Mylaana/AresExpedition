package com.ares_expedition.controller.websocket;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.ares_expedition.dto.websocket.PlayerMessageAnswer;

@Controller
public class WsControllerOutput {
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public WsControllerOutput(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void sendPushToPlayer(Integer gameId, Integer playerId, PlayerMessageAnswer message){
        messagingTemplate.convertAndSend(String.format("/topic/player/%d/%d", gameId, playerId), message);
    }

    public void sendPushToGroup(Integer gameId, PlayerMessageAnswer message){
        messagingTemplate.convertAndSend(String.format("/topic/group/%d", gameId), message);
    }
}
