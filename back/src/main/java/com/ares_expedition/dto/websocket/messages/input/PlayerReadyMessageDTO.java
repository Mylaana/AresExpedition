package com.ares_expedition.dto.websocket.messages.input;

import com.ares_expedition.dto.websocket.content.input.PlayerReadyContentDTO;
import com.ares_expedition.enums.websocket.ContentQueryEnum;

public class PlayerReadyMessageDTO extends BaseMessageInputDTO<PlayerReadyContentDTO> {
    protected PlayerReadyContentDTO content;

    public PlayerReadyMessageDTO(){};

    public PlayerReadyMessageDTO(String gameId, String playerId, ContentQueryEnum contentType, PlayerReadyContentDTO content){
        this.gameId = gameId;
        this.playerId = playerId;
        this.contentEnum = contentType;
        this.content = content;
    }

    public PlayerReadyContentDTO getContent(){
        return this.content;
    }

    public void setContent(PlayerReadyContentDTO content){
        this.content = content;
    }

    public Boolean getPlayerReady(){
        return this.content.getReady();
    }

    public void setPlayerReady(Boolean ready){
        this.content.setReady(ready);
    }
}
