package com.ares_expedition.model.player_state;

import java.util.List;
import java.util.Map;

import com.ares_expedition.dto.websocket.content.player_state.PlayerStateDTO;

public class PlayerState {
    private PlayerInfoState infoState = new PlayerInfoState();
    private PlayerScoreState scoreState = new PlayerScoreState();
    private PlayerTagState tagState = new PlayerTagState();
    private PlayerRessourceState ressourceState = new PlayerRessourceState();
    private PlayerProjectCardState projectCardState = new PlayerProjectCardState();
    private PlayerPhaseCardState phaseCardState = new PlayerPhaseCardState();
    private PlayerGlobalParameterState globalParameterState = new PlayerGlobalParameterState();
    private PlayerOtherState otherState = new PlayerOtherState();

    public PlayerState(){
    }
    
    public PlayerState(PlayerStateDTO dto) {
        this.infoState = PlayerInfoState.fromJson(dto.getInfoState());
        this.scoreState = PlayerScoreState.fromJson(dto.getScoreState());
        this.tagState = PlayerTagState.fromJson(dto.getTagState());
        this.ressourceState = PlayerRessourceState.fromJson(dto.getRessourceState());
        this.projectCardState = PlayerProjectCardState.fromJson(dto.getProjectCardState());
        this.phaseCardState = PlayerPhaseCardState.fromJson(dto.getPhaseCardState());
        this.globalParameterState = PlayerGlobalParameterState.fromJson(dto.getGlobalParameterState());
        this.otherState = PlayerOtherState.fromJson(dto.getOtherState());
    }

    //=============================================================
    //Info
    public PlayerInfoState getInfoState() {
        return this.infoState;
    }
    public void setInfoState(PlayerInfoState state) {
        this.infoState = state;
    }

    public Integer getId() {
        return this.infoState.getId();
    }

    public void setId(Integer id) {
        this.infoState.setId(id);
    }

    public String getName() {
        return this.infoState.getName();
    }

    public void setName(String name) {
        this.infoState.setName(name);
    }

    public String getColor() {
        return this.infoState.getColor();
    }

    public void setColor(String color) {
        this.infoState.setColor(color);
    }


    //=============================================================
    //Score
    public PlayerScoreState getScoreState() {
        return scoreState;
    }

    public void setScoreState(PlayerScoreState scoreState) {
        this.scoreState = scoreState;
    }

    public Integer getTerraformingRating() {
        return scoreState.getTerraformingRating();
    }

    public void setTerraformingRating(Integer terraformingRating) {
        this.scoreState.setTerraformingRating(terraformingRating);
    }

    public Integer getVp() {
        return this.scoreState.getVp();
    }

    public void setVp(Integer vp) {
        this.scoreState.setVp(vp);
    }

    public Integer getMilestoneCount() {
        return this.scoreState.getMilestoneCount();
    }

    public void setMilestoneCount(Integer milestoneCount) {
        this.scoreState.setMilestoneCount(milestoneCount);
    }


    //=============================================================
    //Tags
    public PlayerTagState getTagState() {
        return tagState;
    }

    public void setTagState(PlayerTagState tagState) {
        this.tagState = tagState;
    }

    public List<Map<String, Object>> getTags() {
        return this.tagState.getTags();
    }

    public void setTags(List<Map<String, Object>> tags) {
        this.tagState.setTags(tags);
    }


    //=============================================================
    //Ressources
    public PlayerRessourceState getRessourceState() {
        return ressourceState;
    }

    public void setRessourceState(PlayerRessourceState resssourceState) {
        this.ressourceState = resssourceState;
    }

    public List<Map<String, Object>> getRessource() {
        return this.ressourceState.getRessources();
    }

    public void setRessource(List<Map<String, Object>> ressource) {
        this.ressourceState.setRessources(ressource);;
    }


    //=============================================================
    //Project Cards
    public PlayerProjectCardState getProjectCardState() {
        return projectCardState;
    }

    public void setProjectCardState(PlayerProjectCardState projectCardState) {
        this.projectCardState = projectCardState;
    }
    
    public Map<String, Object> getCards() {
        return this.projectCardState.getProjectCards();
    }

    public void setCards(Map<String, Object> cards) {
        this.projectCardState.setProjectCards(cards);
    }


    //=============================================================
    //Phase Cards
    public PlayerPhaseCardState getPhaseCardState() {
        return phaseCardState;
    }

    public void setPhaseCardState(PlayerPhaseCardState phaseCardState) {
        this.phaseCardState = phaseCardState;
    }


    public Map<String, Object> getPhaseCards() {
        return this.phaseCardState.getPhaseCards();
    }

    public void setPhaseCards(Map<String, Object> phaseCards) {
        this.phaseCardState.setPhaseCards(phaseCards);
    }

    /*
    public Integer getPhaseCardUpgradeCount() {
        return this.phaseCardState;
    }
    
    public void setPhaseCardUpgradeCount(Integer phaseCardUpgradeCount) {
        this.phaseCardUpgradeCount = phaseCardUpgradeCount;
    }
    */
    

    //=============================================================
    //Global parameters
    public PlayerGlobalParameterState getGlobalParameterState() {
        return globalParameterState;
    }

    public void setGlobalParameterState(PlayerGlobalParameterState globalParameterState) {
        this.globalParameterState = globalParameterState;
    }

    
    public Map<String, Object> getGlobalParameter() {
        return globalParameterState.getGlobalParameters();
    }

    public void setGlobalParameter(Map<String, Object> globalParameter) {
        this.globalParameterState.setGlobalParameters(globalParameter);(globalParameter);
    }

    //=============================================================
    //Other
    public PlayerOtherState getOtherState() {
        return otherState;
    }

    public void setOtherState(PlayerOtherState otherState) {
        this.otherState = otherState;
    }


    public Integer getSellCardValueMod() {
        return this.otherState.getSellCardValueMod();
    }

    public void setSellCardValueMod(Integer sellCardValueMod) {
        this.otherState.setSellCardValueMod(sellCardValueMod);
    }

    public Map<String, Object> getResearch() {
        return this.otherState.getResearch();
    }

    public void setResearch(Map<String, Object> research) {
        this.otherState.setResearch(research);
    }

    /*
    public static PlayerState fromJson(PlayerStateDTO statePush){
        PlayerState state = new PlayerState();
        /*
        state.setCards(statePush.getCards());
        state.setResearch(statePush.getResearch());
        state.setPhaseCards(statePush.getPhaseCards());
        state.setPhaseCardUpgradeCount(statePush.getPhaseCardUpgradeCount());
        state.setSellCardValueMod(statePush.getSellCardValueMod());
        state.setGlobalParameter(statePush.getGlobalParameter());
        
        state.setInfoState(PlayerInfoState.fromJson(statePush.getInfoState()));
        state.setScoreState(PlayerScoreState.fromJson(statePush.getScoreState()));
        state.setTagState(PlayerTagState.fromJson(statePush.getTagState()));
        state.setRessourceState(PlayerRessourceState.fromJson(statePush.getRessourceState()));
        state.setProjectCardState(PlayerProjectCardState.fromJson(statePush.getProjectCardState()));
    
        return state;
    }
    */
    public static PlayerState fromJson(PlayerStateDTO dto) {
        return new PlayerState(dto);
    }
    public PlayerStateDTO toJson() {
        return new PlayerStateDTO(this);
    }
}
