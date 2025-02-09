package com.ares_expedition.dto.websocket.content.input;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.ares_expedition.dto.websocket.content.player_state.PlayerInfoStateDTO;
import com.ares_expedition.dto.websocket.content.player_state.PlayerScoreStateDTO;

public class PlayerStateContentDTO extends BaseContentDTO {
	private List<Map<String, Object>> ressource = new ArrayList<>();
    private List<Map<String, Object>> tag = new ArrayList<>();
    private Map<String, Object> cards = new HashMap<>();
    private Map<String, Object> research = new HashMap<>();
	private Map<String, Object> phaseCards = new HashMap<>();
	private Integer phaseCardUpgradeCount;
	private Integer sellCardValueMod;
	private Map<String, Object> globalParameter = new HashMap<>();

	private PlayerInfoStateDTO infoState;
	private PlayerScoreStateDTO scoreState;

	public PlayerStateContentDTO(){
	}
	
	public PlayerInfoStateDTO getStateInfo() {
		return infoState;
	}

	public void setStateInfo(PlayerInfoStateDTO dto) {
		this.infoState = dto;
	}

	public PlayerScoreStateDTO getScoreState() {
		return scoreState;
	}

	public void setScoreState(PlayerScoreStateDTO dto) {
		this.scoreState = dto;
	}
	
	public List<Map<String, Object>> getRessource(){
		return this.ressource;
	}

	public void setRessource(List<Map<String, Object>> ressource) {
		this.ressource = ressource;
	}
	
	public List<Map<String, Object>> getTag(){
		return this.tag;
	}

	public void setTag(List<Map<String, Object>> tag) {
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
}
