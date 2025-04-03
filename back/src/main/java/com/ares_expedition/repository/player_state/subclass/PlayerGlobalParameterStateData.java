package com.ares_expedition.repository.player_state.subclass;

import java.util.ArrayList;
import java.util.List;

import com.ares_expedition.model.player_state.subclass.PlayerGlobalParameterState;
import com.ares_expedition.model.player_state.subclass.substates.GlobalParameter;
import com.ares_expedition.repository.core.GlobalParameterData;

public class PlayerGlobalParameterStateData {
    private List<GlobalParameterData> globalParameters = new ArrayList<GlobalParameterData>();

    public PlayerGlobalParameterStateData(){
    }
    public PlayerGlobalParameterStateData(PlayerGlobalParameterState state){
        this.globalParameters = GlobalParameter.toDataList(state.getGlobalParameters());
    }
    public List<GlobalParameterData> getGlobalParameters() {
        return globalParameters;
    }
    public void setGlobalParameters(List<GlobalParameterData> globalParameters) {
        this.globalParameters = globalParameters;
    }
}
