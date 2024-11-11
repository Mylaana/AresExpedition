package com.ares_expedition.services;

import java.util.Map;

import com.ares_expedition.dto.websocket.PlayerMessageQuery;
import com.ares_expedition.dto.websocket.serialized_message.DrawMessageQuery;
import com.ares_expedition.model.draw.DrawQuery;

public class QueryMessageFactory {
    public static <T> DrawMessageQuery createDrawMessageQuery(PlayerMessageQuery<T> playerMessageQuery){
        DrawMessageQuery drawQuery = new DrawMessageQuery();
        
        drawQuery.setGameId(playerMessageQuery.getGameId());
        drawQuery.setClientId(playerMessageQuery.getClientId());
        drawQuery.setContentEnum(playerMessageQuery.getContentEnum());
        drawQuery.setContent(toDrawQuery(playerMessageQuery.getContent()));

        return drawQuery;
    }
    private static <T> DrawQuery toDrawQuery(T content){
        DrawQuery result = new DrawQuery();
        if(!(content instanceof Map<?, ?>)){return result;}

        Map<?, ?> contentMap = (Map<?, ?>) content;
        Object drawNumber = contentMap.get("draw");

        if(!(drawNumber instanceof Integer)){return result;}
        result.setDrawNumber((Integer) drawNumber);
        
        return result;
    }
}
