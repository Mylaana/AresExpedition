package com.ares_expedition.model.query.player;

import java.util.HashMap;
import java.util.Map;

import com.ares_expedition.model.query.BaseQuery;

public class PlayerStateDTO extends BaseQuery {
	private Integer id;
	private String name;
	private String color;
	private Map<String, Object> ressource = new HashMap<>();
	private Integer terraformingRating;
	private Integer vp;
	private Map<String, Object> tag = new HashMap<>();
	private Map<String, Object> cards = new HashMap<>();
	private Map<String, Object> research = new HashMap<>();
	private Map<String, Object> phaseCards = new HashMap<>();; 
	private Integer phaseCardUpgradeCount;
	private Integer sellCardValueMod;
	private Map<String, Object> globalParameter = new HashMap<>();
	private Integer milestoneCount;

	public PlayerStateDTO(){
	}
	
	@SuppressWarnings("unchecked")
	public PlayerStateDTO(Map<String, Object> data) {
		this.id = (Integer) data.get("id");
		this.name = (String) data.get("name");
		this.color = (String) data.get("color");
		//this.ressource = (Map<String, Object>) data.get("ressource");
		this.terraformingRating = (Integer) data.get("terraformingRating");
		this.vp = (Integer) data.get("vp");
		//this.tag = (Map<String, Object>) data.get("tag");
		//this.cards = (Map<String, Object>) data.get("cards");
		//this.research = (Map<String, Object>) data.get("research");
		//this.phaseCards = (Map<String, Object>) data.get("phaseCards");
		this.phaseCardUpgradeCount = (Integer) data.get("phaseCardUpgradeCount");
		this.sellCardValueMod = (Integer) data.get("sellCardValueMod");
		//this.globalParameter = (Map<String, Object>) data.get("globalParameter");
		this.milestoneCount = (Integer) data.get("milestoneCount");
	}

	public Integer getId(){
		return this.id;
	}
	
	public void setId(Integer id){
		this.id = id;
	}

	public String getName(){
		return this.name;
	}

	public void setName(String name){
		this.name = name;
	}

	public String getColor(){
		return this.color;
	}

	public void setColor(String color) {
		this.color = color;
	}

	public Map<String, Object> getRessources(){
		return this.ressource;
	}

	public void setRessources(Map<String, Object> ressources) {
		this.ressource = ressources;
	}
	
	public Integer getTerraformingRating(){
		return this.terraformingRating;
	}

	public void setTerraformingRating(Integer terraformingRating) {
        this.terraformingRating = terraformingRating;
    }

	public Integer getVp(){
		return this.vp;
	}

	public void setVp(Integer vp) {
        this.vp = vp;
    }
	
	public Map<String, Object> getTag(){
		return this.tag;
	}

	public void setTag(Map<String, Object> tag) {
        this.tag = tag;
    }
	
	public Map<String, Object> getCards(){
		return this.cards;
	}
    
	public void setCards(Map<String, Object> cards) {
        this.cards = cards;
    }
	
	public Map<String, Object> getResearch(){
		return this.research;
	}
    
	public void setResearch(Map<String, Object> research) {
        this.research = research;
    }
	
	public Map<String, Object> getPhaseCards(){
		return this.phaseCards;
	}
    
	public void setPhaseCards(Map<String, Object> phaseCards) {
        this.phaseCards = phaseCards;
    }
	
	public Integer getPhaseCardUpgradeCount(){
		return this.phaseCardUpgradeCount;
	}
    
	public void setPhaseCardUpgradeCount(Integer phaseCardUpgradeCount) {
        this.phaseCardUpgradeCount = phaseCardUpgradeCount;
    }
	
	public Integer getSellCardValueMod(){
		return this.sellCardValueMod;
	}
    
	public void setSellCardValueMod(Integer sellCardValueMod) {
        this.sellCardValueMod = sellCardValueMod;
    }
	
	public Map<String, Object> getGlobalParameter(){
		return this.globalParameter;
	}
    
	public void setGlobalParameter(Map<String, Object> globalParameter) {
        this.globalParameter = globalParameter;
    }
	
	public Integer getMilestoneCount(){
		return this.milestoneCount;
	}
    
	public void setMilestoneCount(Integer milestoneCount) {
        this.milestoneCount = milestoneCount;
    }
}
