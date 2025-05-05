package com.ares_expedition.dto.websocket.content.player_state.subclass.substates;

import java.util.HashMap;
import java.util.Map;

import com.ares_expedition.model.player_state.subclass.substates.EventState;

public class EventStateDTO {
    Map<String, Object> event = new HashMap<>();
    
    EventStateDTO(){
    }
    
    public EventStateDTO(EventState state){
        this.event = state.getEvent();
    }

    public Map<String, Object> getEvent() {
        return event;
    }

    public void setEvent(Map<String, Object> event) {
        this.event = event;
    }
}
