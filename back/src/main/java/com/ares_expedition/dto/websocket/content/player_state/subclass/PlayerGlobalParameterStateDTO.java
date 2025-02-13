package com.ares_expedition.dto.websocket.content.player_state.subclass;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.ares_expedition.model.player_state.PlayerGlobalParameterState;
import com.fasterxml.jackson.annotation.JsonProperty;

public class PlayerGlobalParameterStateDTO {
    @JsonProperty("gp")
    private List<Map<String, Object>> globalParameters = new ArrayList<Map<String, Object>>();

    PlayerGlobalParameterStateDTO() {
    }
    
    public PlayerGlobalParameterStateDTO(PlayerGlobalParameterState state) {
        this.globalParameters = state.getGlobalParameters();
    }
    public List<Map<String, Object>> getGlobalParameters() {
        return globalParameters;
    }

    public void setGlobalParameters(List<Map<String, Object>> globalParameter) {
        this.globalParameters = globalParameter;
    }
}
