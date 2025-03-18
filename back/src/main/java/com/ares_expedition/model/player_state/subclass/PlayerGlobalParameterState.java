package com.ares_expedition.model.player_state.subclass;

import java.util.ArrayList;
import java.util.List;

import com.ares_expedition.dto.websocket.content.player_state.subclass.PlayerGlobalParameterStateDTO;
import com.ares_expedition.dto.websocket.content.player_state.subclass.substates.GlobalParameterDTO;
import com.ares_expedition.model.player_state.subclass.substates.GlobalParameter;

public class PlayerGlobalParameterState {
    private List<GlobalParameter> globalParameters = new ArrayList<GlobalParameter>();

    public PlayerGlobalParameterState() {
    }
    PlayerGlobalParameterState(PlayerGlobalParameterStateDTO dto) {
        for (GlobalParameterDTO param : dto.getGlobalParameters()) {
            this.globalParameters.add(GlobalParameter.fromJson(param));
        }
    }
    public List<GlobalParameter> getGlobalParameters() {
        return globalParameters;
    }
    public void setGlobalParameters(List<GlobalParameter> globalParameters) {
        this.globalParameters = globalParameters;
    }

    public static PlayerGlobalParameterState fromJson(PlayerGlobalParameterStateDTO dto) {
        return new PlayerGlobalParameterState(dto);
    }
    public PlayerGlobalParameterStateDTO toJson() {
        return new PlayerGlobalParameterStateDTO(this);
    }
}
