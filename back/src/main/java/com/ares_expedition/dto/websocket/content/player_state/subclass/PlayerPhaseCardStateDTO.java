package com.ares_expedition.dto.websocket.content.player_state.subclass;

import java.util.ArrayList;
import java.util.List;

import com.ares_expedition.dto.websocket.content.player_state.subclass.substates.PhaseCardDTO;
import com.ares_expedition.enums.game.PhaseEnum;
import com.ares_expedition.model.player_state.subclass.PlayerPhaseCardState;
import com.ares_expedition.model.player_state.subclass.substates.PhaseCard;
import com.fasterxml.jackson.annotation.JsonProperty;

public class PlayerPhaseCardStateDTO {
    @JsonProperty("pc")
    private List<PhaseCardDTO> phaseCards = new ArrayList<PhaseCardDTO>();
    @JsonProperty("sp")
    private PhaseEnum selectedPhase;
    @JsonProperty("psp")
    private PhaseEnum previousSelectedPhase;

    PlayerPhaseCardStateDTO() {
    }

    public PlayerPhaseCardStateDTO(PlayerPhaseCardState state) {
        for (PhaseCard card : state.getPhaseCards()) {
            this.phaseCards.add(card.toJson());
        }
        this.selectedPhase = state.getSelectedPhase();
        this.previousSelectedPhase = state.getPreviousSelectedPhase();
    }

    public List<PhaseCardDTO> getPhaseCards() {
        return phaseCards;
    }

    public void setphaseCards(List<PhaseCardDTO> phaseCards) {
        this.phaseCards = phaseCards;
    }

    public PhaseEnum getSelectedPhase() {
        return selectedPhase;
    }

    public void setSelectedPhase(PhaseEnum selectedPhase) {
        this.selectedPhase = selectedPhase;
    }

    public PhaseEnum getPreviousSelectedPhase() {
        return previousSelectedPhase;
    }

    public void setPreviousSelectedPhase(PhaseEnum previousSelectedPhase) {
        this.previousSelectedPhase = previousSelectedPhase;
    }    

    
}
