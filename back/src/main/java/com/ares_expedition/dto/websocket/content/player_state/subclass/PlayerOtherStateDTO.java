package com.ares_expedition.dto.websocket.content.player_state.subclass;

import java.util.HashMap;
import java.util.Map;

import com.ares_expedition.model.player_state.PlayerOtherState;

public class PlayerOtherStateDTO {
    private Map<String, Object> research = new HashMap<>();
	private Integer phaseCardUpgradeCount;
	private Integer sellCardValueMod;

    PlayerOtherStateDTO() {
    }

    public PlayerOtherStateDTO(PlayerOtherState state) {
        this.research = state.getResearch();
        this.phaseCardUpgradeCount = state.getPhaseCardUpgradeCount();
        this.sellCardValueMod = state.getSellCardValueMod();
    }

    public Map<String, Object> getResearch() {
        return research;
    }

    public void setResearch(Map<String, Object> research) {
        this.research = research;
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
}
