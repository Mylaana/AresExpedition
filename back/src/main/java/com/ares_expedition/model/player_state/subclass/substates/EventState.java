package com.ares_expedition.model.player_state.subclass.substates;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.ares_expedition.dto.websocket.content.player_state.subclass.substates.EventStateDTO;
import com.ares_expedition.enums.game.EventStateOrigin;
import com.ares_expedition.enums.game.EventStateTypeEnum;
import com.ares_expedition.enums.game.ScanKeepOptionsEnum;
import com.ares_expedition.model.core.Ocean;

public class EventState {
    EventStateOrigin origin;
    EventStateTypeEnum type;
    Object value = new HashMap<>();
    
    EventState(){
    }
    
    public EventState(EventStateTypeEnum type, Object value){
        this.origin = EventStateOrigin.CREATE;
        this.type = type;
        this.value = value;
    }
    public EventState(EventStateDTO dto){
        this.origin = dto.getOrigin();
        this.type = dto.getType();
        this.value = dto.getValue();
    }

    public EventState(Ocean ocean){
        this.origin = EventStateOrigin.CREATE;
        this.type = EventStateTypeEnum.OCEAN_FLIPPED;
        this.value = ocean.getBonuses();
    }

    public static EventState addEventDrawCards(List<String> cards) {
        return new EventState(EventStateTypeEnum.DRAW_CARDS, cards);
    }

    public static EventState addEventResearchCards(List<String> cards, Integer keep) {
        Map<String, Object> content = new HashMap<>();
        content.put("cards", cards);
        content.put("keep", keep);
        return new EventState(EventStateTypeEnum.RESEARCH_CARDS_QUERIED, content);
    }

    public static EventState addEventScanKeepCards(List<String> cards, Integer keep, ScanKeepOptionsEnum options) {
        Map<String, Object> content = new HashMap<>();
        content.put("cards", cards);
        content.put("keep", keep);
        content.put("options", options);
        return new EventState(EventStateTypeEnum.SCAN_KEEP_QUERIED, content);
    }

    public static EventState addEventProductionCards(List<String> cards) {
        return new EventState(EventStateTypeEnum.PRODUCTION_CARDS, cards);
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
