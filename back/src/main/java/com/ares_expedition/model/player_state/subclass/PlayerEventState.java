package com.ares_expedition.model.player_state.subclass;

import java.util.ArrayList;
import java.util.List;

import com.ares_expedition.dto.websocket.content.player_state.subclass.PlayerEventStateDTO;
import com.ares_expedition.dto.websocket.content.player_state.subclass.substates.EventStateDTO;
import com.ares_expedition.enums.game.ScanKeepOptionsEnum;
import com.ares_expedition.model.core.Ocean;
import com.ares_expedition.model.player_state.subclass.substates.EventState;

public class PlayerEventState {
    List<EventState> events = new ArrayList<>();

    public PlayerEventState(){
    }

    public PlayerEventState(PlayerEventStateDTO playerStateDTO){
        //this.events = dto.getEvents();
        for(EventStateDTO dto: playerStateDTO.getEvents()){
            this.events.add(new EventState(dto));
        }
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

    public void addEventOceans(List<Ocean> oceans) {
        for(Ocean ocean: oceans){
            this.events.add(new EventState(ocean));
        }
    }

    public void addEventDrawCards(List<String> cards, Integer thenDiscard) {
        this.events.add(EventState.addEventDrawCards(cards, thenDiscard));
    }

    public void addEventResearchCards(List<String> cards, Integer keep) {
        this.events.add(EventState.addEventResearchCards(cards, keep));
    }

    public void addEventScanKeepCards(List<String> cards, Integer keep, ScanKeepOptionsEnum options) {
        this.events.add(EventState.addEventScanKeepCards(cards, keep, options));
    }

    public void addEventProductionCards(List<String> cards) {
        this.events.add(EventState.addEventProductionCards(cards));
    }

    public void addEventCardProductionDouble(List<String> cards, List<String> firstCardProduction) {
        this.events.add(EventState.addEventCardProductionDouble(cards, firstCardProduction));
    }

    public PlayerEventStateDTO toJson() {
        return new PlayerEventStateDTO(this);
    }

    public static PlayerEventState fromJson(PlayerEventStateDTO dto) {
        return new PlayerEventState(dto);
    }
}
