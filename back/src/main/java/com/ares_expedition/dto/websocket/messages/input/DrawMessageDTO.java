package com.ares_expedition.dto.websocket.messages.input;

import com.ares_expedition.dto.websocket.content.draw.DrawQuery;
import com.ares_expedition.enums.websocket.ContentQueryEnum;

public class DrawMessageDTO extends BaseMessageDTO<DrawQuery> {
    protected DrawQuery content;

    public DrawMessageDTO(){};

    public DrawMessageDTO(Integer gameId, Integer clientId, ContentQueryEnum contentType, DrawQuery content){
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

    public Integer getEventId(){
        return content.getEventId();
    }
}
