package com.ares_expedition.controller.websocket;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.ares_expedition.dto.websocket.messages.output.AckMessageOutput;
import com.ares_expedition.dto.websocket.messages.output.BaseMessageOutputDTO;

@Controller
public class WsControllerOutput {
    private final SimpMessagingTemplate messagingTemplate;

    public WsControllerOutput(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void sendPushToPlayer(BaseMessageOutputDTO message, Integer playerId){
        System.out.println("\u001B[35m Sending message on player channel: " + message.getContentEnum() +" with player id: " + playerId + "\u001B[0m");
        messagingTemplate.convertAndSend(String.format("/topic/player/%d/%d", message.getGameId(), playerId), message);
    }

    public void sendPushToGroup(BaseMessageOutputDTO message){
        System.out.println("\u001B[35m Sending message on group channel: " + message.getContentEnum() + "\u001B[0m");
        messagingTemplate.convertAndSend(String.format("/topic/group/%d", message.getGameId()), message);
    }
	
	public void sendAckToPlayer(AckMessageOutput message, Integer playerId){
        System.out.println("\u001B[35m Sending Acknowledge on ack channel: " + message.getContentEnum() +" with player id: " + playerId + " uuid:" + message.getUuid() + "\u001B[0m");
        messagingTemplate.convertAndSend(String.format("/topic/player/%d/%d", message.getGameId(), playerId), message);
    }
}