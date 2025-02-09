package com.ares_expedition.dto.websocket.content.player_state;

import com.ares_expedition.model.player_state.PlayerState;

public class PlayerStateDTO {
    PlayerInfoStateDTO infoState;
    PlayerScoreStateDTO scoreState;
    PlayerTagStateDTO tagState;
    PlayerRessourceStateDTO ressourceState;

    PlayerStateDTO(){
    }

    public PlayerStateDTO(PlayerState state) {
        this.infoState = state.getInfoState().toJson();
        this.scoreState = state.getScoreState().toJson();
        this.tagState = state.getTagState().toJson();
        this.ressourceState = state.getRessourceState().toJson();
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

    public PlayerTagStateDTO getTagState() {
        return tagState;
    }

    public void setTagState(PlayerTagStateDTO tagState) {
        this.tagState = tagState;
    }

    public PlayerRessourceStateDTO getRessourceState() {
        return ressourceState;
    }

    public void setRessourceState(PlayerRessourceStateDTO ressourceState) {
        this.ressourceState = ressourceState;
    }
}
