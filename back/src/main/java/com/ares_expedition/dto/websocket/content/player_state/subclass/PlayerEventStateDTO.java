package com.ares_expedition.dto.websocket.content.player_state.subclass;

import java.util.ArrayList;
import java.util.List;

import com.ares_expedition.dto.websocket.content.player_state.subclass.substates.EventStateDTO;
import com.ares_expedition.model.player_state.subclass.PlayerEventState;
import com.ares_expedition.model.player_state.subclass.substates.EventState;
import com.fasterxml.jackson.annotation.JsonProperty;

public class PlayerEventStateDTO {
    @JsonProperty("e")
    List<EventStateDTO> events = new ArrayList<>();

    PlayerEventStateDTO(){
    }
    public PlayerEventStateDTO(PlayerEventState state){
        for(EventState e: state.getEvents()){
            this.events.add(e.toJson());
        }
    }

    public List<EventStateDTO> getEvents() {
        return events;
    }

    public void setEvents(List<EventStateDTO> events) {
        this.events = events;
    } 
}
