package com.ares_expedition.dto.websocket.content.input;

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
