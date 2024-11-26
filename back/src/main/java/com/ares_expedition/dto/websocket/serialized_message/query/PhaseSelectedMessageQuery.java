package com.ares_expedition.dto.websocket.serialized_message.query;

import com.ares_expedition.enums.websocket.ContentQueryEnum;
import com.ares_expedition.model.query.player.PhaseSelectedQuery;

public class PhaseSelectedMessageQuery extends PlayerMessageQuery<PhaseSelectedQuery> {
    protected PhaseSelectedQuery content;

    public PhaseSelectedMessageQuery(){};

    public PhaseSelectedMessageQuery(Integer gameId, Integer clientId, ContentQueryEnum contentType, PhaseSelectedQuery content){
        this.gameId = gameId;
        this.playerId = clientId;
        this.contentEnum = contentType;
        this.content = content;
    }

    public PhaseSelectedQuery getContent(){
        return this.content;
    }

    public void setContent(PhaseSelectedQuery content){
        this.content = content;
    }
}
