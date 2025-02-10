package com.ares_expedition.dto.websocket.messages.input;

import com.ares_expedition.dto.websocket.content.player_state.PlayerStateDTO;
import com.ares_expedition.enums.websocket.ContentQueryEnum;

public class PlayerStateMessageDTO extends BaseMessageInputDTO<PlayerStateDTO> {
    protected PlayerStateDTO content;

    public PlayerStateMessageDTO(){};

    public PlayerStateMessageDTO(Integer gameId, Integer clientId, ContentQueryEnum contentType, PlayerStateDTO content){
        this.gameId = gameId;
        this.playerId = clientId;
        this.contentEnum = contentType;
        this.content = content;
    }

    public PlayerStateDTO getContent(){
        return this.content;
    }

    public void setContent(PlayerStateDTO content){
        this.content = content;
    }
}
