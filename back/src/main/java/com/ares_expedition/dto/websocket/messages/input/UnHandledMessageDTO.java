package com.ares_expedition.dto.websocket.messages.input;

import com.ares_expedition.dto.websocket.content.input.UnHandledContentDTO;
import com.ares_expedition.enums.websocket.ContentQueryEnum;

public class UnHandledMessageDTO extends BaseMessageInputDTO<UnHandledContentDTO> {
    protected UnHandledContentDTO content;

    public UnHandledMessageDTO(){};

    public UnHandledMessageDTO(Integer gameId, Integer clientId, ContentQueryEnum contentType, UnHandledContentDTO content){
        this.gameId = gameId;
        this.playerId = clientId;
        this.contentEnum = contentType;
        this.content = content;
    }

    public UnHandledContentDTO getContent(){
        return this.content;
    }

    public void setContent(UnHandledContentDTO content){
        this.content = content;
    }
}
