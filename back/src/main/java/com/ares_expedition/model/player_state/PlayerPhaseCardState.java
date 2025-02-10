package com.ares_expedition.model.player_state;

import java.util.HashMap;
import java.util.Map;

import com.ares_expedition.dto.websocket.content.player_state.subclass.PlayerPhaseCardStateDTO;

public class PlayerPhaseCardState {
    private Map<String, Object> phaseCards = new HashMap<>();

    PlayerPhaseCardState() {
    }

    PlayerPhaseCardState(PlayerPhaseCardStateDTO dto) {
        this.phaseCards = dto.getPhaseCards();
    }

    public Map<String, Object> getPhaseCards() {
        return phaseCards;
    }

    public void setPhaseCards(Map<String, Object> phaseCards) {
        this.phaseCards = phaseCards;
    }
    
    public static PlayerPhaseCardState fromJson(PlayerPhaseCardStateDTO dto) {
        return new PlayerPhaseCardState(dto);
    }

    public PlayerPhaseCardStateDTO toJson() {
        return new PlayerPhaseCardStateDTO(this);
    }
}
