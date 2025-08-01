package com.ares_expedition.dto.websocket.content.player_state.subclass;

import java.util.List;

import com.ares_expedition.enums.game.MilestonesEnum;
import com.ares_expedition.model.player_state.subclass.PlayerScoreState;
import com.fasterxml.jackson.annotation.JsonProperty;

public class PlayerScoreStateDTO {
    @JsonProperty("v")
    private Integer vp;
    @JsonProperty("tr")
    private Integer terraformingRating;
    @JsonProperty("f")
    private Integer forest;
    @JsonProperty("cm")
    private List<MilestonesEnum> claimedMilestone;

    PlayerScoreStateDTO() {
    }

    public PlayerScoreStateDTO(PlayerScoreState state) {
        this.vp = state.getVp();
        this.terraformingRating = state.getTerraformingRating();
        this.forest = state.getForest();
        this.claimedMilestone = state.getClaimedMilestone();
    }

    public Integer getVp() {
        return vp;
    }
    public void setVp(Integer vp) {
        this.vp = vp;
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
    public List<MilestonesEnum> getClaimedMilestone() {
        return claimedMilestone;
    }
    public void setClaimedMilestone(List<MilestonesEnum> claimedMilestone) {
        this.claimedMilestone = claimedMilestone;
    }
}
