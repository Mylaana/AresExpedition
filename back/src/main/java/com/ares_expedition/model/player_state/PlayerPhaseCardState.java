package com.ares_expedition.model.player_state;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.ares_expedition.dto.websocket.content.player_state.subclass.PlayerPhaseCardStateDTO;
import com.ares_expedition.enums.game.PhaseEnum;

public class PlayerPhaseCardState {
    private List<Map<String, Object>> phaseGroups = new ArrayList<Map<String, Object>>();
    private Number phaseCardUpgradedCount;
    private PhaseEnum selectedPhase;

    PlayerPhaseCardState() {
    }

    PlayerPhaseCardState(PlayerPhaseCardStateDTO dto) {
        this.phaseGroups = dto.getPhaseGroups();
        this.phaseCardUpgradedCount = dto.getPhaseCardUpgradedCount();
        this.selectedPhase = dto.getSelectedPhase();
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

    public static PlayerPhaseCardState fromJson(PlayerPhaseCardStateDTO dto) {
        return new PlayerPhaseCardState(dto);
    }

    public PlayerPhaseCardStateDTO toJson() {
        return new PlayerPhaseCardStateDTO(this);
    }
}
