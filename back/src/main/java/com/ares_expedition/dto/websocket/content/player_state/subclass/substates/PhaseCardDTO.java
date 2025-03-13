package com.ares_expedition.dto.websocket.content.player_state.subclass.substates;

import com.ares_expedition.model.player_state.subclass.substates.PhaseCard;
import com.fasterxml.jackson.annotation.JsonProperty;

public class PhaseCardDTO {
    @JsonProperty("cl")
    Number cardLevel;
    @JsonProperty("pi")
    Number phaseIndex;

    PhaseCardDTO(){
    }

    public PhaseCardDTO(PhaseCard state){
        this.cardLevel = state.getCardLevel();
        this.phaseIndex = state.getPhaseIndex();
    }

    public Number getCardLevel() {
        return cardLevel;
    }

    public void setCardLevel(Number cardLevel) {
        this.cardLevel = cardLevel;
    }

    public Number getPhaseIndex() {
        return phaseIndex;
    }

    public void setPhaseIndex(Number phaseIndex) {
        this.phaseIndex = phaseIndex;
    }
}
