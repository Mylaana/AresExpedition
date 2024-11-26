package com.ares_expedition.dto.websocket.serialized_message.query;

import com.ares_expedition.enums.websocket.ContentQueryEnum;
import com.ares_expedition.model.query.player.GenericQuery;

public class GenericMessageQuery extends PlayerMessageQuery<GenericQuery> {
    GenericQuery content;

    public GenericMessageQuery(){
    }

    public GenericMessageQuery(Integer gameId, Integer clientId, ContentQueryEnum contentType, GenericQuery content){
        this.gameId = gameId;
        this.playerId = clientId;
        this.contentEnum = contentType;
        this.content = content;
    }

    public GenericQuery getContent(){
        return this.content;
    }

    public void setContent(GenericQuery content){
        this.content = content;
    }
}
