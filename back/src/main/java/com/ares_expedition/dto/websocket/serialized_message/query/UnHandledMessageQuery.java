package com.ares_expedition.dto.websocket.serialized_message.query;

import com.ares_expedition.enums.websocket.ContentQueryEnum;
import com.ares_expedition.model.query.player.UnHandledQuery;

public class UnHandledMessageQuery extends PlayerMessageQuery<UnHandledQuery> {
    protected UnHandledQuery content;

    public UnHandledMessageQuery(){};

    public UnHandledMessageQuery(Integer gameId, Integer clientId, ContentQueryEnum contentType, UnHandledQuery content){
        this.gameId = gameId;
        this.playerId = clientId;
        this.contentEnum = contentType;
        this.content = content;
    }

    public UnHandledQuery getContent(){
        return this.content;
    }

    public void setContent(UnHandledQuery content){
        this.content = content;
    }
}
