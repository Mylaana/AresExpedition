package com.ares_expedition.controller.websocket;

import org.springframework.stereotype.Service;

import com.ares_expedition.dto.websocket.PlayerMessageQuery;
import com.ares_expedition.dto.websocket.serialized_message.DrawMessageQuery;
import com.ares_expedition.repository.GameController;
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
                Integer drawNumber = query.getDrawNumber();
                if(drawNumber == 0){break;}
                wsOutput.sendPushToPlayer(query.getGameId(), query.getClientId(), GameController.drawCards(query.getGameId(), drawNumber));
                break;
            
            case PLAYER_READY:

                break;
            
            default:
                break;
        }
    }
}
