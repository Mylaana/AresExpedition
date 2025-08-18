package com.ares_expedition.repository.player_state;

import com.ares_expedition.model.player_state.PlayerState;
import com.ares_expedition.model.player_state.subclass.PlayerEventState;
import com.ares_expedition.model.player_state.subclass.PlayerGlobalParameterState;
import com.ares_expedition.model.player_state.subclass.PlayerInfoState;
import com.ares_expedition.model.player_state.subclass.PlayerOtherState;
import com.ares_expedition.model.player_state.subclass.PlayerPhaseCardState;
import com.ares_expedition.model.player_state.subclass.PlayerProjectCardState;
import com.ares_expedition.model.player_state.subclass.PlayerRessourceState;
import com.ares_expedition.model.player_state.subclass.PlayerScoreState;
import com.ares_expedition.model.player_state.subclass.PlayerStatState;
import com.ares_expedition.model.player_state.subclass.PlayerTagState;
import com.ares_expedition.repository.player_state.subclass.PlayerGlobalParameterStateData;

public class PlayerStateData {
    private PlayerInfoState infoState = new PlayerInfoState();
    private PlayerScoreState scoreState = new PlayerScoreState();
    private PlayerTagState tagState = new PlayerTagState();
    private PlayerRessourceState ressourceState = new PlayerRessourceState();
    private PlayerProjectCardState projectCardState = new PlayerProjectCardState();
    private PlayerPhaseCardState phaseCardState = new PlayerPhaseCardState();
    private PlayerGlobalParameterStateData globalParameterState = new PlayerGlobalParameterStateData();
    private PlayerEventState eventState = new PlayerEventState();
    private PlayerOtherState otherState = new PlayerOtherState();
    private PlayerStatState statState = new PlayerStatState();

    PlayerStateData(){
    }
    public PlayerStateData(PlayerState state){
        this.infoState = state.getInfoState();
        this.scoreState = state.getScoreState();
        this.tagState = state.getTagState();
        this.ressourceState = state.getRessourceState();
        this.projectCardState = state.getProjectCardState();
        this.phaseCardState = state.getPhaseCardState();
        this.globalParameterState = PlayerGlobalParameterState.toData(state.getGlobalParameterState());
        this.eventState = state.getEventState();
        this.otherState = state.getOtherState();
        this.statState = state.getStatState();
    }
    public PlayerInfoState getInfoState() {
        return infoState;
    }
    public void setInfoState(PlayerInfoState infoState) {
        this.infoState = infoState;
    }
    public PlayerScoreState getScoreState() {
        return scoreState;
    }
    public void setScoreState(PlayerScoreState scoreState) {
        this.scoreState = scoreState;
    }
    public PlayerTagState getTagState() {
        return tagState;
    }
    public void setTagState(PlayerTagState tagState) {
        this.tagState = tagState;
    }
    public PlayerRessourceState getRessourceState() {
        return ressourceState;
    }
    public void setRessourceState(PlayerRessourceState ressourceState) {
        this.ressourceState = ressourceState;
    }
    public PlayerProjectCardState getProjectCardState() {
        return projectCardState;
    }
    public void setProjectCardState(PlayerProjectCardState projectCardState) {
        this.projectCardState = projectCardState;
    }
    public PlayerPhaseCardState getPhaseCardState() {
        return phaseCardState;
    }
    public void setPhaseCardState(PlayerPhaseCardState phaseCardState) {
        this.phaseCardState = phaseCardState;
    }
    public PlayerGlobalParameterStateData getGlobalParameterState() {
        return globalParameterState;
    }
    public void setGlobalParameterState(PlayerGlobalParameterStateData globalParameterState) {
        this.globalParameterState = globalParameterState;
    }
    public PlayerEventState getEventState() {
        return eventState;
    }
    public void setEventState(PlayerEventState eventState) {
        this.eventState = eventState;
    }
    public PlayerOtherState getOtherState() {
        return otherState;
    }
    public void setOtherState(PlayerOtherState otherState) {
        this.otherState = otherState;
    }
    public PlayerStatState getStatState() {
        return statState;
    }
    public void setStatState(PlayerStatState statState) {
        this.statState = statState;
    }
}
