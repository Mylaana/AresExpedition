package com.ares_expedition.model.player_state;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.ares_expedition.dto.websocket.content.input.PlayerStateContentDTO;
import com.ares_expedition.dto.websocket.content.player_state.PlayerStateDTO;

public class PlayerState {
    private List<Map<String, Object>> ressource = new ArrayList<>();
    private List<Map<String, Object>> tag = new ArrayList<>();
    private Map<String, Object> cards = new HashMap<>();
    private Map<String, Object> research = new HashMap<>();
	private Map<String, Object> phaseCards = new HashMap<>();
	private Integer phaseCardUpgradeCount;
	private Integer sellCardValueMod;
	private Map<String, Object> globalParameter = new HashMap<>();

    private PlayerInfoState infoState = new PlayerInfoState();
    private PlayerScoreState scoreState = new PlayerScoreState();

    public PlayerState(){
    }
    
    //InfoState
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

    //ScoreState
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

    public List<Map<String, Object>> getRessource() {
        return ressource;}

    public void setRessource(List<Map<String, Object>> ressource) {
        this.ressource = ressource;
    }

    public List<Map<String, Object>> getTag() {
        return tag;
    }

    public void setTag(List<Map<String, Object>> tag) {
        this.tag = tag;
    }

    public Map<String, Object> getCards() {
        return cards;
    }

    public void setCards(Map<String, Object> cards) {
        this.cards = cards;
    }

    public Map<String, Object> getResearch() {
        return research;
    }

    public void setResearch(Map<String, Object> research) {
        this.research = research;
    }

    public Map<String, Object> getPhaseCards() {
        return phaseCards;
    }

    public void setPhaseCards(Map<String, Object> phaseCards) {
        this.phaseCards = phaseCards;
    }

    public Integer getPhaseCardUpgradeCount() {
        return phaseCardUpgradeCount;
    }

    public void setPhaseCardUpgradeCount(Integer phaseCardUpgradeCount) {
        this.phaseCardUpgradeCount = phaseCardUpgradeCount;
    }

    public Integer getSellCardValueMod() {
        return sellCardValueMod;
    }

    public void setSellCardValueMod(Integer sellCardValueMod) {
        this.sellCardValueMod = sellCardValueMod;
    }

    public Map<String, Object> getGlobalParameter() {
        return globalParameter;
    }

    public void setGlobalParameter(Map<String, Object> globalParameter) {
        this.globalParameter = globalParameter;
    }

    public PlayerInfoState getInfoState() {
        return this.infoState;
    }
    public void setInfoState(PlayerInfoState state) {
        this.infoState = state;
    }

    public PlayerScoreState getScoreState() {
        return scoreState;
    }

    public void setScoreState(PlayerScoreState scoreState) {
        this.scoreState = scoreState;
    }

    public static PlayerState fromJson(PlayerStateContentDTO statePush){
        PlayerState state = new PlayerState();
        
        state.setRessource(statePush.getRessource());
        state.setTag(statePush.getTag());
        state.setCards(statePush.getCards());
        state.setResearch(statePush.getResearch());
        state.setPhaseCards(statePush.getPhaseCards());
        state.setPhaseCardUpgradeCount(statePush.getPhaseCardUpgradeCount());
        state.setSellCardValueMod(statePush.getSellCardValueMod());
        state.setGlobalParameter(statePush.getGlobalParameter());

        state.setInfoState(PlayerInfoState.fromJson(statePush.getStateInfo()));
        state.setScoreState(PlayerScoreState.fromJson(statePush.getScoreState()));
    
        return state;
    }
    public PlayerStateDTO toJson() {
        return new PlayerStateDTO(this);
    }
}
