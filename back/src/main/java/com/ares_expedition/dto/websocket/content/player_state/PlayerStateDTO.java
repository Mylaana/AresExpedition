package com.ares_expedition.dto.websocket.content.player_state;

import com.ares_expedition.model.player_state.PlayerState;

public class PlayerStateDTO {
    PlayerInfoStateDTO infoState;
    PlayerScoreStateDTO scoreState;

    PlayerStateDTO(){
    }

    public PlayerStateDTO(PlayerState state) {
        this.infoState = state.getInfoState().toJson();
        this.scoreState = state.getScoreState().toJson();
    }

    public PlayerInfoStateDTO getInfoState() {
        return infoState;
    }

    public void setInfoState(PlayerInfoStateDTO infoState) {
        this.infoState = infoState;
    }

    public PlayerScoreStateDTO getScoreState() {
        return scoreState;
    }

    public void setScoreState(PlayerScoreStateDTO scoreState) {
        this.scoreState = scoreState;
    }
}
