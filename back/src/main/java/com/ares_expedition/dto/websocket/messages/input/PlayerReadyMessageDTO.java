package com.ares_expedition.dto.websocket.messages.input;

import com.ares_expedition.dto.websocket.content.player.PlayerReadyContentDTO;
import com.ares_expedition.enums.websocket.ContentQueryEnum;

public class PlayerReadyMessageDTO extends BaseMessageDTO<PlayerReadyContentDTO> {
    protected PlayerReadyContentDTO content;

    public PlayerReadyMessageDTO(){};

    public PlayerReadyMessageDTO(Integer gameId, Integer playerId, ContentQueryEnum contentType, PlayerReadyContentDTO content){
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
