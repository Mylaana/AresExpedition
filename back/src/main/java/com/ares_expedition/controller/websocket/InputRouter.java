package com.ares_expedition.controller.websocket;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ares_expedition.dto.websocket.PlayerMessageQuery;
import com.ares_expedition.model.draw.DrawQuery;

@Service
public class InputRouter {
    @Autowired
    InputRouter(){}

    public void routeInput(PlayerMessageQuery message){
        switch (message.getContentEnum()) {
            case DRAW_QUERY:
                DrawQuery query = (DrawQuery) message.getContent();
                break;
            
            case PLAYER_READY:

                break;
            
            default:
                break;
        }
    }
}
