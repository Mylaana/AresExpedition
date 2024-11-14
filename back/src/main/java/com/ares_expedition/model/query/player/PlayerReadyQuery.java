package com.ares_expedition.model.query.player;

import java.util.Map;

import com.ares_expedition.model.query.GenericQuery;

public class PlayerReadyQuery extends GenericQuery{
    Boolean ready;

    public PlayerReadyQuery(){
    }

    public PlayerReadyQuery(Boolean ready){
        this.ready = ready;
    }
    public PlayerReadyQuery(Map<String, Object> data) {
        this.ready = (Boolean) data.get("ready");
    }

    public Boolean getPlayerReady(){
        return this.ready;
    }

    public void setPlayerReady(Boolean ready){
        this.ready = ready;
    }
}
