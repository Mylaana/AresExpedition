package com.ares_expedition.dto.websocket.content.player;

import com.ares_expedition.dto.websocket.content.BaseContentDTO;

public class PlayerReadyContentDTO extends BaseContentDTO{
    Boolean ready = false;

    public PlayerReadyContentDTO(){
    }

    public PlayerReadyContentDTO(Boolean ready){
        this.ready = ready;
    }

    public Boolean getReady(){
        return this.ready;
    }

    public void setReady(Boolean ready){
        this.ready = ready;
    }
}
