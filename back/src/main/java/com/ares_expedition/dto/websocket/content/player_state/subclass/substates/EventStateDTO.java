package com.ares_expedition.dto.websocket.content.player_state.subclass.substates;

import java.util.HashMap;
import com.ares_expedition.enums.game.EventStateOrigin;
import com.ares_expedition.enums.game.EventStateTypeEnum;
import com.ares_expedition.model.player_state.subclass.substates.EventState;
import com.fasterxml.jackson.annotation.JsonProperty;

public class EventStateDTO {
    @JsonProperty("o")
    EventStateOrigin origin;
    @JsonProperty("t")
    EventStateTypeEnum type;
    @JsonProperty("v")
    Object value = new HashMap<>();
    
    EventStateDTO(){
    }
    
    public EventStateDTO(EventState state){
        this.origin = state.getOrigin();
        this.type = state.getType();
        this.value = state.getValue();
    }

    public Object getValue() {
        return value;
    }
    
    public void setValue(Object value) {
        this.value = value;
    }

    public EventStateTypeEnum getType() {
        return type;
    }

    public void setType(EventStateTypeEnum type) {
        this.type = type;
    }

    public EventStateOrigin getOrigin() {
        return origin;
    }

    public void setOrigin(EventStateOrigin operation) {
        this.origin = operation;
    }    
}
