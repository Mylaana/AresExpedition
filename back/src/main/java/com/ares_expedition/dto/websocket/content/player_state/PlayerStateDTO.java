package com.ares_expedition.dto.websocket.content.player_state;

import com.ares_expedition.dto.websocket.content.input.BaseContentDTO;
import com.ares_expedition.dto.websocket.content.player_state.subclass.PlayerEventStateDTO;
import com.ares_expedition.dto.websocket.content.player_state.subclass.PlayerGlobalParameterStateDTO;
import com.ares_expedition.dto.websocket.content.player_state.subclass.PlayerInfoStateDTO;
import com.ares_expedition.dto.websocket.content.player_state.subclass.PlayerOtherStateDTO;
import com.ares_expedition.dto.websocket.content.player_state.subclass.PlayerPhaseCardStateDTO;
import com.ares_expedition.dto.websocket.content.player_state.subclass.PlayerProjectCardStateDTO;
import com.ares_expedition.dto.websocket.content.player_state.subclass.PlayerRessourceStateDTO;
import com.ares_expedition.dto.websocket.content.player_state.subclass.PlayerScoreStateDTO;
import com.ares_expedition.dto.websocket.content.player_state.subclass.PlayerTagStateDTO;
import com.ares_expedition.model.player_state.PlayerState;

public class PlayerStateDTO extends BaseContentDTO {
    PlayerInfoStateDTO infoState;
    PlayerScoreStateDTO scoreState;
    PlayerTagStateDTO tagState;
    PlayerRessourceStateDTO ressourceState;
    PlayerProjectCardStateDTO projectCardState;
    PlayerPhaseCardStateDTO phaseCardState;
    PlayerGlobalParameterStateDTO globalParameterState;
    PlayerEventStateDTO eventState;
    PlayerOtherStateDTO otherState;

    PlayerStateDTO(){
    }

    public PlayerStateDTO(PlayerState state) {
        this.infoState = state.getInfoState().toJson();
        this.scoreState = state.getScoreState().toJson();
        this.tagState = state.getTagState().toJson();
        this.ressourceState = state.getRessourceState().toJson();
        this.projectCardState = state.getProjectCardState().toJson();
        this.phaseCardState = state.getPhaseCardState().toJson();
        this.globalParameterState = state.getGlobalParameterState().toJson();
        this.eventState = state.getEventState().toJson();
        this.otherState = state.getOtherState().toJson();
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

    public PlayerProjectCardStateDTO getProjectCardState() {
        return projectCardState;
    }

    public void setProjectCardState(PlayerProjectCardStateDTO projectCardState) {
        this.projectCardState = projectCardState;
    }

    public PlayerPhaseCardStateDTO getPhaseCardState() {
        return phaseCardState;
    }

    public void setPhaseCardState(PlayerPhaseCardStateDTO phaseCardState) {
        this.phaseCardState = phaseCardState;
    }

    public PlayerGlobalParameterStateDTO getGlobalParameterState() {
        return globalParameterState;
    }

    public void setGlobalParameterState(PlayerGlobalParameterStateDTO globalParameterState) {
        this.globalParameterState = globalParameterState;
    }

    public PlayerOtherStateDTO getOtherState() {
        return otherState;
    }

    public void setOtherState(PlayerOtherStateDTO otherState) {
        this.otherState = otherState;
    }

    public PlayerEventStateDTO getEventState() {
        return eventState;
    }

    public void setEventState(PlayerEventStateDTO eventState) {
        this.eventState = eventState;
    }
}
