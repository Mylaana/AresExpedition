package com.ares_expedition.model.player_state.subclass.substates;

import com.ares_expedition.dto.websocket.content.player_state.subclass.substates.PhaseCardDTO;

public class PhaseCard {
    Number cardLevel;
    Number phaseIndex;

    PhaseCard(){
    }

    PhaseCard(PhaseCardDTO dto){
        this.cardLevel = dto.getCardLevel();
        this.phaseIndex = dto.getPhaseIndex();
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

    public static PhaseCard fromJson(PhaseCardDTO dto) {
        return new PhaseCard(dto);
    }

    public PhaseCardDTO toJson() {
        return new PhaseCardDTO(this);
    }
}
