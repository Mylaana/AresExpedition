package com.ares_expedition.model.player_state.subclass;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.ares_expedition.dto.websocket.content.player_state.subclass.PlayerGlobalParameterStateDTO;

public class PlayerGlobalParameterState {
    private List<Map<String, Object>> globalParameters = new ArrayList<Map<String, Object>>();

    public PlayerGlobalParameterState() {
    }
    PlayerGlobalParameterState(PlayerGlobalParameterStateDTO dto) {
        this.globalParameters = dto.getGlobalParameters();
    }
    public List<Map<String, Object>> getGlobalParameters() {
        return globalParameters;
    }
    public void setGlobalParameters(List<Map<String, Object>> globalParameters) {
        this.globalParameters = globalParameters;
    }

    public static PlayerGlobalParameterState fromJson(PlayerGlobalParameterStateDTO dto) {
        return new PlayerGlobalParameterState(dto);
    }
    public PlayerGlobalParameterStateDTO toJson() {
        return new PlayerGlobalParameterStateDTO(this);
    }
}
