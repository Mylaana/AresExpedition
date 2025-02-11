package com.ares_expedition.model.player_state;

import java.util.List;
import java.util.Map;

import com.ares_expedition.dto.websocket.content.player_state.PlayerStateDTO;
import com.ares_expedition.dto.websocket.content.player_state.subclass.PlayerPhaseCardStateDTO;
import com.ares_expedition.enums.game.PhaseEnum;

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

    public List<Integer> getHand() {
        return projectCardState.getHand();
    }

    public void setHand(List<Integer> hand) {
        this.projectCardState.setHand(hand);
    }

    public List<Integer> getPlayedProjectIdList() {
        return projectCardState.getPlayedProjectIdList();
    }

    public void setPlayedProjectIdList(List<Integer> playedProjectIdList) {
        this.projectCardState.setPlayedProjectIdList(playedProjectIdList);
    }

    public Map<Integer, Object> getPlayedProjectCardStocks() {
        return this.projectCardState.getPlayedProjectCardStocks();
    }

    public void setProjectCardStocks(Map<Integer, Object> projectCardStocks) {
        this.projectCardState.setPlayedProjectCardStocks(projectCardStocks);
    }

    public Map<String, Object> getTriggers() {
        return this.projectCardState.getTriggers();
    }

    public void setTriggers(Map<String, Object> triggers) {
        this.projectCardState.setTriggers(triggers);
    }

    public Integer getHandMaximumSize() {
        return this.projectCardState.getHandMaximumSize();
    }

    public void setHandMaximumSize(Integer handMaximumSize) {
        this.projectCardState.setHandMaximumSize(handMaximumSize);
    }

    //=============================================================
    //Phase Cards
    public PlayerPhaseCardState getPhaseCardState() {
        return phaseCardState;
    }

    public void setPhaseCardState(PlayerPhaseCardState phaseCardState) {
        this.phaseCardState = phaseCardState;
    }

        public List<Map<String, Object>> getPhaseGroups() {
        return this.phaseCardState.getPhaseGroups();
    }

    public void setPhaseGroups(List<Map<String, Object>> phaseGroups) {
        this.phaseCardState.setPhaseGroups(phaseGroups);
    }

    public Number getPhaseCardUpgradedCount() {
        return this.phaseCardState.getPhaseCardUpgradedCount();
    }

    public void setPhaseCardUpgradedCount(Number phaseCardUpgradedCount) {
        this.phaseCardState.setPhaseCardUpgradedCount(phaseCardUpgradedCount);
    }

    public PhaseEnum getSelectedPhase() {
        return this.phaseCardState.getSelectedPhase();
    }

    public void setSelectedPhase(PhaseEnum selectedPhase) {
        this.phaseCardState.setSelectedPhase(selectedPhase);
    }

    public static PlayerPhaseCardState fromJson(PlayerPhaseCardStateDTO dto) {
        return new PlayerPhaseCardState(dto);
    }    

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
        this.globalParameterState.setGlobalParameters(globalParameter);
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
