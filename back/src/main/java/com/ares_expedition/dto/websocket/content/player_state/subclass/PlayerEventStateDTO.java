package com.ares_expedition.dto.websocket.content.player_state.subclass;

import java.util.ArrayList;
import java.util.List;

import com.ares_expedition.model.player_state.subclass.PlayerEventState;
import com.fasterxml.jackson.annotation.JsonProperty;

public class PlayerEventStateDTO {
    @JsonProperty("e")
    List<Object> events = new ArrayList<>();

    PlayerEventStateDTO(){
    }
    public PlayerEventStateDTO(PlayerEventState state){
        this.events = state.getEvents();
    }

    public List<Object> getEvents() {
        return events;
    }

    public void setEvents(List<Object> events) {
        this.events = events;
    } 
}
