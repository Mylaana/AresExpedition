package com.ares_expedition.dto.websocket.content.player_state.subclass;

import java.util.HashMap;
import java.util.Map;

import com.ares_expedition.model.player_state.PlayerProjectCardState;

public class PlayerProjectCardStateDTO {
    private Map<String, Object> projectCardState = new HashMap<>();

    PlayerProjectCardStateDTO() {
    }

    public PlayerProjectCardStateDTO(PlayerProjectCardState state) {
        this.projectCardState = state.getProjectCards();
    }

    public Map<String, Object> getProjectCardState() {
        return projectCardState;
    }

    public void setProjectCardState(Map<String, Object> projectCardState) {
        this.projectCardState = projectCardState;
    }
        
}
