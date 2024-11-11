package com.ares_expedition.controller.websocket;

import org.springframework.stereotype.Service;

import com.ares_expedition.dto.websocket.PlayerMessageQuery;
import com.ares_expedition.dto.websocket.serialized_message.DrawMessageQuery;
import com.ares_expedition.services.QueryMessageFactory;

@Service
public class InputRouter {
    private final WsControllerOutput wsOutput;

    public InputRouter(WsControllerOutput wsOutput){
        this.wsOutput = wsOutput;
    }

    public <T> void routeInput(PlayerMessageQuery<T> message){
        switch (message.getContentEnum()) {
            case DRAW_QUERY:
                DrawMessageQuery query = QueryMessageFactory.createDrawMessageQuery(message);
                wsOutput.sendPushToPlayer(query.getGameId(), query.getClientId(), query.getContent());
                break;
            
            case PLAYER_READY:

                break;
            
            default:
                break;
        }
    }
}
