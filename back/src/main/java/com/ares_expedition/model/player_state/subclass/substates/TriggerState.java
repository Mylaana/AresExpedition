package com.ares_expedition.model.player_state.subclass.substates;
import java.util.List;

import com.ares_expedition.dto.websocket.content.player_state.subclass.substates.TriggerStateDTO;

public class TriggerState {
    List<String> playedCardsId;
    List<String> activeCardsId;

    public TriggerState(){
    }

    TriggerState(TriggerStateDTO dto){
        this.playedCardsId = dto.getPlayedCardsId();
        this.activeCardsId = dto.getActiveCardsId();
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

    public static TriggerState fromJson(TriggerStateDTO dto) {
        return new TriggerState(dto);
    }
    public TriggerStateDTO toJson() {
        return new TriggerStateDTO(this);
    }
}
