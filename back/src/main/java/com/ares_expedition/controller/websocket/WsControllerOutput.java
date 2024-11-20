package com.ares_expedition.controller.websocket;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.ares_expedition.dto.websocket.serialized_message.answer.PlayerMessageAnswer;

@Controller
public class WsControllerOutput {
    private final SimpMessagingTemplate messagingTemplate;

    public WsControllerOutput(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void sendPushToPlayer(PlayerMessageAnswer message, Integer playerId){
        messagingTemplate.convertAndSend(String.format("/topic/player/%d/%d", message.getGameId(), playerId), message);
    }

    public void sendPushToGroup(PlayerMessageAnswer message){
        messagingTemplate.convertAndSend(String.format("/topic/group/%d", message.getGameId()), message);
    }
}