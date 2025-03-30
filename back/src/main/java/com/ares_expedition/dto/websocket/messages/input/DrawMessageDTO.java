package com.ares_expedition.dto.websocket.messages.input;

import com.ares_expedition.dto.websocket.content.input.DrawContentDTO;
import com.ares_expedition.enums.websocket.ContentQueryEnum;

public class DrawMessageDTO extends BaseMessageInputDTO<DrawContentDTO> {
    protected DrawContentDTO content;

    public DrawMessageDTO(){};

    public DrawMessageDTO(String gameId, String clientId, ContentQueryEnum contentType, DrawContentDTO content){
        this.gameId = gameId;
        this.playerId = clientId;
        this.contentEnum = contentType;
        this.content = content;
    }

    public DrawContentDTO getContent(){
        return this.content;
    }

    public void setContent(DrawContentDTO content){
        this.content = content;
    }

    public Integer getDrawNumber(){
        return this.content.getDrawNumber();
    }

    public Integer getEventId(){
        return content.getEventId();
    }
}
