package com.ares_expedition.dto.websocket.content.player_state.subclass;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.ares_expedition.enums.game.PhaseEnum;
import com.ares_expedition.model.player_state.PlayerPhaseCardState;

public class PlayerPhaseCardStateDTO {
    private List<Map<String, Object>> phaseGroups = new ArrayList<Map<String, Object>>();
    private Number phaseCardUpgradedCount;
    private PhaseEnum selectedPhase;

    PlayerPhaseCardStateDTO() {
    }

    public PlayerPhaseCardStateDTO(PlayerPhaseCardState state) {
        this.phaseGroups = state.getPhaseGroups();
        this.phaseCardUpgradedCount = state.getPhaseCardUpgradedCount();
        this.selectedPhase = state.getSelectedPhase();
    }

    public List<Map<String, Object>> getPhaseGroups() {
        return phaseGroups;
    }

    public void setPhaseGroups(List<Map<String, Object>> phaseGroups) {
        this.phaseGroups = phaseGroups;
    }

    public Number getPhaseCardUpgradedCount() {
        return phaseCardUpgradedCount;
    }

    public void setPhaseCardUpgradedCount(Number phaseCardUpgradedCount) {
        this.phaseCardUpgradedCount = phaseCardUpgradedCount;
    }

    public PhaseEnum getSelectedPhase() {
        return selectedPhase;
    }

    public void setSelectedPhase(PhaseEnum selectedPhase) {
        this.selectedPhase = selectedPhase;
    }

    

    
}
