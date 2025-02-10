package com.ares_expedition.dto.websocket.content.player_state.subclass;

import java.util.HashMap;
import java.util.Map;

import com.ares_expedition.model.player_state.PlayerGlobalParameterState;

public class PlayerGlobalParameterStateDTO {
    private Map<String, Object> globalParameters = new HashMap<>();

    PlayerGlobalParameterStateDTO() {
    }
    
    public PlayerGlobalParameterStateDTO(PlayerGlobalParameterState state) {
        this.globalParameters = state.getGlobalParameters();
    }
    public Map<String, Object> getGlobalParameters() {
        return globalParameters;
    }

    public void setGlobalParameters(Map<String, Object> globalParameter) {
        this.globalParameters = globalParameter;
    }
}
