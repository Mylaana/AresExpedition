package com.ares_expedition.dto.websocket.content.player_state.subclass.substates;

import java.util.List;
import com.ares_expedition.model.player_state.subclass.substates.TriggerState;
import com.fasterxml.jackson.annotation.JsonProperty;

public class TriggerStateDTO {
    @JsonProperty("p")
    List<String> playedCardsId;
    @JsonProperty("a")
    List<String> activeCardsId;

    public TriggerStateDTO(){
    }

    public TriggerStateDTO(TriggerState state){
        this.playedCardsId = state.getPlayedCardsId();
        this.activeCardsId = state.getActiveCardsId();
    }

    public List<String> getPlayedCardsId() {
        return playedCardsId;
    }
    public void setPlayedCardsId(List<String> playedCardsId) {
        this.playedCardsId = playedCardsId;
    }
    public List<String> getActiveCardsId() {
        return activeCardsId;
    }
    public void setActiveCardsId(List<String> activeCardsId) {
        this.activeCardsId = activeCardsId;
    }
}
