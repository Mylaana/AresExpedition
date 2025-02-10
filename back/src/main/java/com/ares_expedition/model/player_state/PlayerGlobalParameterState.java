package com.ares_expedition.model.player_state;

import java.util.HashMap;
import java.util.Map;

import com.ares_expedition.dto.websocket.content.player_state.subclass.PlayerGlobalParameterStateDTO;

public class PlayerGlobalParameterState {
    private Map<String, Object> globalParameters = new HashMap<>();

    PlayerGlobalParameterState() {
    }
    PlayerGlobalParameterState(PlayerGlobalParameterStateDTO dto) {
        this.globalParameters = dto.getGlobalParameters();
    }
    public Map<String, Object> getGlobalParameters() {
        return globalParameters;
    }
    public void setGlobalParameters(Map<String, Object> globalParameters) {
        this.globalParameters = globalParameters;
    }

    public static PlayerGlobalParameterState fromJson(PlayerGlobalParameterStateDTO dto) {
        return new PlayerGlobalParameterState(dto);
    }
    public PlayerGlobalParameterStateDTO toJson() {
        return new PlayerGlobalParameterStateDTO(this);
    }
}
