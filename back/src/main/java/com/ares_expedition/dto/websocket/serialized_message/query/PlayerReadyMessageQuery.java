package com.ares_expedition.dto.websocket.serialized_message.query;

import com.ares_expedition.enums.websocket.ContentQueryEnum;
import com.ares_expedition.model.query.player.PlayerReadyQuery;

public class PlayerReadyMessageQuery extends PlayerMessageQuery<PlayerReadyQuery> {
    protected PlayerReadyQuery content;

    public PlayerReadyMessageQuery(){};

    public PlayerReadyMessageQuery(Integer gameId, Integer playerId, ContentQueryEnum contentType, PlayerReadyQuery content){
        this.gameId = gameId;
        this.playerId = playerId;
        this.contentEnum = contentType;
        this.content = content;
    }

    public PlayerReadyQuery getContent(){
        return this.content;
    }

    public void setContent(PlayerReadyQuery content){
        this.content = content;
    }

    public Boolean getPlayerReady(Integer playerId){
        return this.content.getPlayerReady();
    }

    public void setPlayerReady(Integer playerId){

    }
}
