package com.ares_expedition.dto.websocket.serialized_message.query;

import com.ares_expedition.enums.websocket.ContentQueryEnum;
import com.ares_expedition.model.query.draw.DrawQuery;

public class DrawMessageQuery extends PlayerMessageQuery<DrawQuery> {
    protected DrawQuery content;

    public DrawMessageQuery(){};

    public DrawMessageQuery(Integer gameId, Integer clientId, ContentQueryEnum contentType, DrawQuery content){
        this.gameId = gameId;
        this.playerId = clientId;
        this.contentEnum = contentType;
        this.content = content;
    }

    public DrawQuery getContent(){
        return this.content;
    }

    public void setContent(DrawQuery content){
        this.content = content;
    }

    public Integer getDrawNumber(){
        return this.content.getDrawNumber();
    }
}
