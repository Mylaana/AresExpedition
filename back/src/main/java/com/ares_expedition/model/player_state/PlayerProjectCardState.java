package com.ares_expedition.model.player_state;

import java.util.HashMap;
import java.util.Map;

import com.ares_expedition.dto.websocket.content.player_state.subclass.PlayerProjectCardStateDTO;

public class PlayerProjectCardState {
    private Map<String, Object> cards = new HashMap<>();

    PlayerProjectCardState() {
    }

    public PlayerProjectCardState(PlayerProjectCardStateDTO dto) {
        this.cards = dto.getProjectCardState();
    }

    public Map<String, Object> getProjectCards() {
        return cards;
    }

    public void setProjectCards(Map<String, Object> cards) {
        this.cards = cards;
    }
    
    public static PlayerProjectCardState fromJson(PlayerProjectCardStateDTO dto) {
        return new PlayerProjectCardState(dto);
    }

    public PlayerProjectCardStateDTO toJson() {
        return new PlayerProjectCardStateDTO(this);
    }
}
