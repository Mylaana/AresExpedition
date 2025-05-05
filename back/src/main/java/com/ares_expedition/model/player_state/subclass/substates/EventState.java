package com.ares_expedition.model.player_state.subclass.substates;

import java.util.HashMap;
import java.util.Map;

import com.ares_expedition.dto.websocket.content.player_state.subclass.substates.EventStateDTO;
import com.ares_expedition.enums.game.EventEnum;
import com.ares_expedition.model.core.Ocean;

public class EventState {
    Map<EventEnum, Object> event = new HashMap<>();
    
    EventState(){
    }
    
    public EventState(Ocean oceans){
        this.event.put(EventEnum.CREATE_EVENT, '');
        this.event.put(EventEnum.VALUE, oceans.getBonuses());
    }

    public Map<EventEnum, Object> getEvent() {
        return event;
    }

    public void setEvent(Map<EventEnum, Object> event) {
        this.event = event;
    }

    public EventStateDTO toJson() {
        return new EventStateDTO(this);
    }
}
