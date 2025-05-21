package com.ares_expedition.repository.player_state.subclass;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.ares_expedition.model.player_state.subclass.PlayerGlobalParameterState;
import com.ares_expedition.model.player_state.subclass.substates.GlobalParameter;
import com.ares_expedition.repository.core.GlobalParameterData;

public class PlayerGlobalParameterStateData {
    private List<GlobalParameterData> globalParameters = new ArrayList<GlobalParameterData>();
    private List<Object> oceanFlippedBonus = new ArrayList<>();

    public PlayerGlobalParameterStateData(){
    }
    public PlayerGlobalParameterStateData(PlayerGlobalParameterState state){
        this.globalParameters = GlobalParameter.toDataList(state.getGlobalParameters());
        this.oceanFlippedBonus = state.getOceanFlippedBonus();
    }
    public List<GlobalParameterData> getGlobalParameters() {
        return globalParameters;
    }
    public void setGlobalParameters(List<GlobalParameterData> globalParameters) {
        this.globalParameters = globalParameters;
    }
    public List<Object> getOceanFlippedBonus() {
        return oceanFlippedBonus;
    }
    public void setOceanFlippedBonus(List<Object> oceanFlippedBonus) {
        this.oceanFlippedBonus = oceanFlippedBonus;
    }
}
