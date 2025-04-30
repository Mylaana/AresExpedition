package com.ares_expedition.model.player_state.subclass;

import java.util.ArrayList;
import java.util.List;

import com.ares_expedition.dto.websocket.content.player_state.subclass.PlayerEventStateDTO;

public class PlayerEventState {
    List<Object> events = new ArrayList<>();

    public PlayerEventState(){
    }
    public PlayerEventState(PlayerEventStateDTO dto){
        this.events = dto.getEvents();
    }

    public List<Object> getEvents() {
        return events;
    }

    public void setEvents(List<Object> events) {
        this.events = events;
    }

    public PlayerEventStateDTO toJson() {
        return new PlayerEventStateDTO(this);
    }

    public static PlayerEventState fromJson(PlayerEventStateDTO dto) {
        return new PlayerEventState(dto);
    }
}
