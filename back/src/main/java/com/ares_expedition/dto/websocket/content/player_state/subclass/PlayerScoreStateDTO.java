package com.ares_expedition.dto.websocket.content.player_state.subclass;

import com.ares_expedition.model.player_state.PlayerScoreState;

public class PlayerScoreStateDTO {
    private Integer vp;
	private Integer milestoneCount;
    private Integer terraformingRating;

    PlayerScoreStateDTO() {
    }

    public PlayerScoreStateDTO(PlayerScoreState state) {
        this.vp = state.getVp();
        this.milestoneCount = state.getMilestoneCount();
        this.terraformingRating = state.getTerraformingRating();
    }

    public Integer getVp() {
        return vp;
    }
    public void setVp(Integer vp) {
        this.vp = vp;
    }
    public Integer getMilestoneCount() {
        return milestoneCount;
    }
    public void setMilestoneCount(Integer milestoneCount) {
        this.milestoneCount = milestoneCount;
    }
    public Integer getTerraformingRating() {
        return terraformingRating;
    }
    public void setTerraformingRating(Integer terraformingRating) {
        this.terraformingRating = terraformingRating;
    }
}
