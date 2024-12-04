package com.ares_expedition.model.game;

import java.util.HashMap;
import java.util.Map;

import com.ares_expedition.model.query.player.PlayerStateDTO;

public class PlayerState {
    private Integer id;
    private String name;
    private String color;
    private Map<String, Object> ressource = new HashMap<>();
    private Integer terraformingRating;
    private Integer vp;
    private Map<String, Object> tag = new HashMap<>();
    private Map<String, Object> cards = new HashMap<>();
    private Map<String, Object> research = new HashMap<>();
	private Map<String, Object> phaseCards; 
	private Integer phaseCardUpgradeCount;
	private Integer sellCardValueMod;
	private Map<String, Object> globalParameter = new HashMap<>();
	private Integer milestoneCount;

    public PlayerState(){
    }
    
    public static PlayerState toModel(PlayerStateDTO statePush){
        PlayerState state = new PlayerState();

        state.setId(statePush.getId());
        state.setName(statePush.getName());
        state.setColor(statePush.getColor());
        state.setRessources(statePush.getRessources());
        state.setTerraformingRating(statePush.getTerraformingRating());
        state.setVp(statePush.getVp());
        state.setTag(statePush.getTag());
        state.setCards(statePush.getCards());
        state.setResearch(statePush.getResearch());
        state.setPhaseCards(statePush.getPhaseCards());
        state.setPhaseCardUpgradeCount(statePush.getPhaseCardUpgradeCount());
        state.setSellCardValueMod(statePush.getSellCardValueMod());
        state.setGlobalParameter(statePush.getGlobalParameter());
        state.setMilestoneCount(statePush.getMilestoneCount());
    
        return state;
    }
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public Map<String, Object> getRessources() {
        return ressource;
    }

    public void setRessources(Map<String, Object> ressource) {
        this.ressource = ressource;
    }

    public Integer getTerraformingRating() {
        return terraformingRating;
    }

    public void setTerraformingRating(Integer terraformingRating) {
        this.terraformingRating = terraformingRating;
    }

    public Integer getVp() {
        return vp;
    }

    public void setVp(Integer vp) {
        this.vp = vp;
    }

    public Map<String, Object> getTag() {
        return tag;
    }

    public void setTag(Map<String, Object> tag) {
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

    public Integer getMilestoneCount() {
        return milestoneCount;
    }

    public void setMilestoneCount(Integer milestoneCount) {
        this.milestoneCount = milestoneCount;
    }
}
