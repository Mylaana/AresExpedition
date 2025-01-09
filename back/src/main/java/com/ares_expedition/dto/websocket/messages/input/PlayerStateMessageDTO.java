package com.ares_expedition.dto.websocket.messages.input;

import com.ares_expedition.dto.websocket.content.input.PlayerStateContentDTO;
import com.ares_expedition.enums.websocket.ContentQueryEnum;

public class PlayerStateMessageDTO extends BaseMessageInputDTO<PlayerStateContentDTO> {
    protected PlayerStateContentDTO content;

    public PlayerStateMessageDTO(){};

    public PlayerStateMessageDTO(Integer gameId, Integer clientId, ContentQueryEnum contentType, PlayerStateContentDTO content){
        this.gameId = gameId;
        this.playerId = clientId;
        this.contentEnum = contentType;
        this.content = content;
    }

    public PlayerStateContentDTO getContent(){
        return this.content;
    }

    public void setContent(PlayerStateContentDTO content){
        this.content = content;
    }
}
