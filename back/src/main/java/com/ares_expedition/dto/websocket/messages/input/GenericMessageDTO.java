package com.ares_expedition.dto.websocket.messages.input;

import com.ares_expedition.dto.websocket.content.input.GenericContentDTO;
import com.ares_expedition.enums.websocket.ContentQueryEnum;


public class GenericMessageDTO extends BaseMessageInputDTO<GenericContentDTO> {
    GenericContentDTO content;

    public GenericMessageDTO(){
    }

    public GenericMessageDTO(Integer gameId, Integer clientId, ContentQueryEnum contentType, GenericContentDTO content){
        this.gameId = gameId;
        this.playerId = clientId;
        this.contentEnum = contentType;
        this.content = content;
    }

    public GenericContentDTO getContent(){
        return this.content;
    }

    public void setContent(GenericContentDTO content){
        this.content = content;
    }
}
