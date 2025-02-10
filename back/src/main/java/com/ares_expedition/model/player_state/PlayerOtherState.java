package com.ares_expedition.model.player_state;

import java.util.HashMap;
import java.util.Map;

import com.ares_expedition.dto.websocket.content.player_state.subclass.PlayerOtherStateDTO;

public class PlayerOtherState {
    private Map<String, Object> research = new HashMap<>();
	private Integer phaseCardUpgradeCount;
	private Integer sellCardValueMod;

    PlayerOtherState() {
    }

    PlayerOtherState(PlayerOtherStateDTO dto) {
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

    public static PlayerOtherState fromJson(PlayerOtherStateDTO dto) {
        return new PlayerOtherState(dto);
    }

    public PlayerOtherStateDTO toJson() {
        return new PlayerOtherStateDTO(this);
    }
}
