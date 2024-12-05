package com.ares_expedition.dto.websocket.messages.input;

import com.ares_expedition.dto.websocket.content.player.PhaseSelectedContentDTO;
import com.ares_expedition.enums.websocket.ContentQueryEnum;


public class PhaseSelectedMessageDTO extends BaseMessageDTO<PhaseSelectedContentDTO> {
    protected PhaseSelectedContentDTO content;

    public PhaseSelectedMessageDTO(){};

    public PhaseSelectedMessageDTO(Integer gameId, Integer clientId, ContentQueryEnum contentType, PhaseSelectedContentDTO content){
        this.gameId = gameId;
        this.playerId = clientId;
        this.contentEnum = contentType;
        this.content = content;
    }

    public PhaseSelectedContentDTO getContent(){
        return this.content;
    }

    public void setContent(PhaseSelectedContentDTO content){
        this.content = content;
    }
}
