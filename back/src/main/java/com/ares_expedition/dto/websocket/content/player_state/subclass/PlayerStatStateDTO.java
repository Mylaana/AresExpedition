package com.ares_expedition.dto.websocket.content.player_state.subclass;

import com.ares_expedition.model.player_state.subclass.PlayerStatState;
import com.fasterxml.jackson.annotation.JsonProperty;

public class PlayerStatStateDTO {
    @JsonProperty("spr")
    private Object selectedPhaseRound;

    PlayerStatStateDTO(){};
    public PlayerStatStateDTO(PlayerStatState state){
        this.selectedPhaseRound = state.getSelectedPhaseRound();
    }
    public Object getSelectedPhaseRound() {
        return selectedPhaseRound;
    }
    public void setSelectedPhaseRound(Object selectedPhaseRound) {
        this.selectedPhaseRound = selectedPhaseRound;
    }

    
}
