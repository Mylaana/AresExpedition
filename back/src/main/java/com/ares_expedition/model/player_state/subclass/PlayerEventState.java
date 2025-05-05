package com.ares_expedition.model.player_state.subclass;

import java.util.ArrayList;
import java.util.List;

import com.ares_expedition.dto.websocket.content.player_state.subclass.PlayerEventStateDTO;
import com.ares_expedition.model.player_state.subclass.substates.EventState;

public class PlayerEventState {
    List<EventState> events = new ArrayList<>();

    public PlayerEventState(){
    }
    public PlayerEventState(PlayerEventStateDTO dto){
        this.events = dto.getEvents();
    }

    public List<EventState> getEvents() {
        return events;
    }

    public void setEvents(List<EventState> events) {
        this.events = events;
    }

    public void addEvent(EventState event) {
        this.events.add(event);
    }

    public PlayerEventStateDTO toJson() {
        return new PlayerEventStateDTO(this);
    }

    public static PlayerEventState fromJson(PlayerEventStateDTO dto) {
        return new PlayerEventState(dto);
    }
}
