package com.ares_expedition.model.query.player;

import com.ares_expedition.model.query.BaseQuery;

public class PlayerReadyQuery extends BaseQuery{
    Boolean ready = false;

    public PlayerReadyQuery(){
    }

    public PlayerReadyQuery(Boolean ready){
        this.ready = ready;
    }

    public Boolean getReady(){
        return this.ready;
    }

    public void setReady(Boolean ready){
        this.ready = ready;
    }
}
