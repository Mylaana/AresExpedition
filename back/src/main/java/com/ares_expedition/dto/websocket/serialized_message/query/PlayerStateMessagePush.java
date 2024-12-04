package com.ares_expedition.dto.websocket.serialized_message.query;

import com.ares_expedition.enums.websocket.ContentQueryEnum;
import com.ares_expedition.model.query.player.PlayerStateDTO;

public class PlayerStateMessagePush extends PlayerMessageQuery<PlayerStateDTO> {
    protected PlayerStateDTO content;

    public PlayerStateMessagePush(){};

    public PlayerStateMessagePush(Integer gameId, Integer clientId, ContentQueryEnum contentType, PlayerStateDTO content){
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
