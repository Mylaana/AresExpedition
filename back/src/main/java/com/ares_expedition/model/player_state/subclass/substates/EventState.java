package com.ares_expedition.model.player_state.subclass.substates;

import java.util.HashMap;
import com.ares_expedition.dto.websocket.content.player_state.subclass.substates.EventStateDTO;
import com.ares_expedition.enums.game.EventStateOrigin;
import com.ares_expedition.enums.game.EventStateTypeEnum;
import com.ares_expedition.model.core.Ocean;

public class EventState {
    EventStateOrigin origin;
    EventStateTypeEnum type;
    Object value = new HashMap<>();
    
    EventState(){
    }
    
    public EventState(EventStateDTO dto){
        this.origin = dto.getOrigin();
        this.type = dto.getType();
        this.value = dto.getValue();
    }

    public EventState(Ocean ocean){
        this.origin = EventStateOrigin.SERVER;
        this.type = EventStateTypeEnum.OCEAN_FLIPPED;
        this.value = ocean.getBonuses();
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

    public void setOrigin(EventStateOrigin origin) {
        this.origin = origin;
    }

    public EventStateDTO toJson() {
        return new EventStateDTO(this);
    }
}
