package com.ares_expedition.model.player_state.subclass.substates;

import java.util.HashMap;
import com.ares_expedition.dto.websocket.content.player_state.subclass.substates.EventStateDTO;
import com.ares_expedition.enums.game.EventStateOperation;
import com.ares_expedition.enums.game.EventStateTypeEnum;
import com.ares_expedition.model.core.Ocean;

public class EventState {
    EventStateOperation operation;
    EventStateTypeEnum type;
    Object value = new HashMap<>();
    
    EventState(){
    }
    
    public EventState(EventStateDTO dto){
        this.operation = dto.getOperation();
        this.type = dto.getType();
        this.value = dto.getValue();
    }

    public EventState(Ocean ocean){
        this.operation = EventStateOperation.CREATE_EVENT;
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

    public EventStateOperation getOperation() {
        return operation;
    }

    public void setOperationType(EventStateOperation operation) {
        this.operation = operation;
    }

    public EventStateDTO toJson() {
        return new EventStateDTO(this);
    }
}
