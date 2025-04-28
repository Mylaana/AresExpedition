package com.ares_expedition.model.player_state.subclass;

import java.util.ArrayList;
import java.util.List;


import com.ares_expedition.dto.websocket.content.player_state.subclass.PlayerPhaseCardStateDTO;
import com.ares_expedition.dto.websocket.content.player_state.subclass.substates.PhaseCardDTO;
import com.ares_expedition.enums.game.PhaseEnum;
import com.ares_expedition.model.player_state.subclass.substates.PhaseCard;

public class PlayerPhaseCardState {
    private List<PhaseCard> phaseCards = new ArrayList<PhaseCard>();
    private PhaseEnum selectedPhase;
    private PhaseEnum previousSelectedPhase;

    public PlayerPhaseCardState() {
    }

    public PlayerPhaseCardState(PlayerPhaseCardStateDTO dto) {
        for (PhaseCardDTO card : dto.getPhaseCards()) {
            this.phaseCards.add(PhaseCard.fromJson(card));
        }
        this.selectedPhase = dto.getSelectedPhase();
        this.previousSelectedPhase = dto.getPreviousSelectedPhase();
    }

    public PhaseEnum getSelectedPhase() {
        return selectedPhase;
    }

    public void setSelectedPhase(PhaseEnum selectedPhase) {
        this.selectedPhase = selectedPhase;
    }
    
    public List<PhaseCard> getPhaseCards() {
        return phaseCards;
    }
    
    public void setPhaseCards(List<PhaseCard> phaseCards) {
        this.phaseCards = phaseCards;
    }

    public static PlayerPhaseCardState fromJson(PlayerPhaseCardStateDTO dto) {
        return new PlayerPhaseCardState(dto);
    }

    public PlayerPhaseCardStateDTO toJson() {
        return new PlayerPhaseCardStateDTO(this);
    }

    public PhaseEnum getPreviousSelectedPhase() {
        return previousSelectedPhase;
    }

    public void setPreviousSelectedPhase(PhaseEnum previousSelectedPhase) {
        this.previousSelectedPhase = previousSelectedPhase;
    }
    
    public void newRound() {
        this.previousSelectedPhase = this.selectedPhase;
        this.selectedPhase = PhaseEnum.UNDEFINED;
    }
}
