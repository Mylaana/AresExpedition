package com.ares_expedition.dto.websocket.content.player_state.subclass;

import java.util.HashMap;
import java.util.Map;

import com.ares_expedition.model.player_state.PlayerPhaseCardState;

public class PlayerPhaseCardStateDTO {
    private Map<String, Object> phaseCards = new HashMap<>();

    PlayerPhaseCardStateDTO() {
    }

    public PlayerPhaseCardStateDTO(PlayerPhaseCardState state) {
        this.phaseCards = state.getPhaseCards();
    }

    public Map<String, Object> getPhaseCards() {
        return phaseCards;
    }

    public void setPhaseCards(Map<String, Object> phaseCards) {
        this.phaseCards = phaseCards;
    }

    
}
