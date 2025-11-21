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
        for(EventStateDTO dto: playerStateDTO.getEvents()){
            this.events.addFirst(new EventState(dto));
        }
    }

    public List<EventState> getEvents() {
        return events;
    }

    public void setEvents(List<EventState> events) {
        this.events = events;
    }

    public void addEvent(EventState event) {
        this.events.addFirst(event);
    }

    public void addEventOceans(List<Ocean> oceans) {
        for(Ocean ocean: oceans){
            this.events.addFirst(new EventState(ocean));
        }
    }

    public void addEventDrawCards(List<String> cards, Integer thenDiscard, Boolean isCardProduction) {
        this.events.addFirst(EventState.addEventDrawCards(cards, thenDiscard, isCardProduction));
    }

    public void addEventDrawCards(List<String> cards, Integer thenDiscard, Boolean isCardProduction, String triggerOrigin) {
        this.events.addFirst(EventState.addEventDrawCards(cards, thenDiscard, isCardProduction, triggerOrigin));
    }

    public void addEventResearchCards(List<String> cards, Integer keep) {
        this.events.addFirst(EventState.addEventResearchCards(cards, keep));
    }

    public void addEventScanKeepCards(List<String> cards, Integer keep, ScanKeepOptionsEnum options) {
        this.events.addFirst(EventState.addEventScanKeepCards(cards, keep, options));
    }

    public void addEventProductionCards(List<String> cards) {
        this.events.addFirst(EventState.addEventProductionCards(cards));
    }

    public void addEventCardProductionDouble(List<String> cards, List<String> firstCardProduction) {
        this.events.addFirst(EventState.addEventCardProductionDouble(cards, firstCardProduction));
    }

    public PlayerEventStateDTO toJson() {
        return new PlayerEventStateDTO(this);
    }

    public static PlayerEventState fromJson(PlayerEventStateDTO dto) {
        return new PlayerEventState(dto);
    }
}
