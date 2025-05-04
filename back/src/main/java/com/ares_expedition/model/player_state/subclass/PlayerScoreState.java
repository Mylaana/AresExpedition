
package com.ares_expedition.model.player_state.subclass;

import com.ares_expedition.dto.websocket.content.player_state.subclass.PlayerScoreStateDTO;

public class PlayerScoreState {
    private Integer vp;
    private Integer milestoneCount;
    private Integer terraformingRating;
    private Integer forest;

    public PlayerScoreState() {
    }
    PlayerScoreState(PlayerScoreStateDTO dto) {
        this.vp = dto.getVp();
        this.milestoneCount = dto.getMilestoneCount();
        this.terraformingRating = dto.getTerraformingRating();
        this.forest = dto.getForest();
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

    public Integer getForest() {
        return forest;
    }

    public void setForest(Integer forest) {
        this.forest = forest;
    }

    public static PlayerScoreState fromJson(PlayerScoreStateDTO dto) {
        return new PlayerScoreState(dto);
    }

    public PlayerScoreStateDTO toJson() {
        return new PlayerScoreStateDTO(this);
    }    
}
