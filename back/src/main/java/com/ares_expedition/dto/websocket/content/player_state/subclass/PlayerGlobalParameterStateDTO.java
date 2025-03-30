package com.ares_expedition.dto.websocket.content.player_state.subclass;

import java.util.ArrayList;
import java.util.List;

import com.ares_expedition.dto.websocket.content.player_state.subclass.substates.GlobalParameterDTO;
import com.ares_expedition.model.player_state.subclass.PlayerGlobalParameterState;
import com.ares_expedition.model.player_state.subclass.substates.GlobalParameter;
import com.fasterxml.jackson.annotation.JsonProperty;

public class PlayerGlobalParameterStateDTO {
    @JsonProperty("gp")
    private List<GlobalParameterDTO> globalParameters = new ArrayList<GlobalParameterDTO>();

    PlayerGlobalParameterStateDTO() {
    }  
    public PlayerGlobalParameterStateDTO(PlayerGlobalParameterState state) {
        for (GlobalParameter param : state.getGlobalParameters()) {
            this.globalParameters.add(param.toJson());
        }
    }
    public List<GlobalParameterDTO> getGlobalParameters() {
        return globalParameters;
    }

    public void setGlobalParameters(List<GlobalParameterDTO> globalParameter) {
        this.globalParameters = globalParameter;
    }
}
