package com.ares_expedition.model.player_state.subclass;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.ares_expedition.dto.websocket.content.player_state.subclass.PlayerGlobalParameterStateDTO;
import com.ares_expedition.dto.websocket.content.player_state.subclass.substates.GlobalParameterDTO;
import com.ares_expedition.model.player_state.subclass.substates.GlobalParameter;
import com.ares_expedition.model.player_state.subclass.substates.OceanFlippedBonus;
import com.ares_expedition.repository.player_state.subclass.PlayerGlobalParameterStateData;

public class PlayerGlobalParameterState {
    private List<GlobalParameter> globalParameters = new ArrayList<GlobalParameter>();
    private OceanFlippedBonus oceanFlippedBonus = new OceanFlippedBonus();

    public PlayerGlobalParameterState() {
    }

    PlayerGlobalParameterState(PlayerGlobalParameterStateDTO dto) {
        for (GlobalParameterDTO param : dto.getGlobalParameters()) {
            this.globalParameters.add(GlobalParameter.fromJson(param));
        }
        this.oceanFlippedBonus = this.oceanFlippedBonusFromJson(dto.getOceanFlippedBonus());
    }

    public List<GlobalParameter> getGlobalParameters() {
        return globalParameters;
    }

    public void setGlobalParameters(List<GlobalParameter> globalParameters) {
        this.globalParameters = globalParameters;
    }

    public OceanFlippedBonus getOceanFlippedBonus() {
        return oceanFlippedBonus;
    }

    public void setOceanFlippedBonus(OceanFlippedBonus oceanFlippedBonus) {
        this.oceanFlippedBonus = oceanFlippedBonus;
    }

    private OceanFlippedBonus oceanFlippedBonusFromJson(List<Map<String, Integer>> bonuses) {
        return new OceanFlippedBonus(bonuses);
    }

    public static PlayerGlobalParameterState fromJson(PlayerGlobalParameterStateDTO dto) {
        return new PlayerGlobalParameterState(dto);
    }
    
    public PlayerGlobalParameterStateDTO toJson() {
        return new PlayerGlobalParameterStateDTO(this);
    }

    public static PlayerGlobalParameterStateData toData(PlayerGlobalParameterState state){
        return new PlayerGlobalParameterStateData(state);
    }
}
