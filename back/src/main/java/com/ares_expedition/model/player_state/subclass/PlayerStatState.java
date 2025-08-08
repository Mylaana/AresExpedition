package com.ares_expedition.model.player_state.subclass;

import com.ares_expedition.dto.websocket.content.player_state.subclass.PlayerStatStateDTO;

public class PlayerStatState {
    private Object selectedPhaseRound;

    public PlayerStatState(){};

    PlayerStatState(PlayerStatStateDTO dto){
        this.selectedPhaseRound = dto.getSelectedPhaseRound();
    }

    public Object getSelectedPhaseRound() {
        return selectedPhaseRound;
    }
    public void setSelectedPhaseRound(Object selectedPhaseRound) {
        this.selectedPhaseRound = selectedPhaseRound;
    }

    public static PlayerStatState fromJson(PlayerStatStateDTO dto) {
        return new PlayerStatState(dto);
    }

    public PlayerStatStateDTO toJson() {
        return new PlayerStatStateDTO(this);
    }
}
