
package com.ares_expedition.model.player_state.subclass;

import java.util.List;

import com.ares_expedition.dto.websocket.content.player_state.subclass.PlayerScoreStateDTO;
import com.ares_expedition.enums.game.MilestonesEnum;

public class PlayerScoreState {
    private Integer vp;
    private Integer terraformingRating;
    private Integer forest;
    private List<MilestonesEnum> claimedMilestone;

    public PlayerScoreState() {
    }
    PlayerScoreState(PlayerScoreStateDTO dto) {
        this.vp = dto.getVp();
        this.terraformingRating = dto.getTerraformingRating();
        this.forest = dto.getForest();
        this.claimedMilestone = dto.getClaimedMilestone();
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

    public static PlayerScoreState fromJson(PlayerScoreStateDTO dto) {
        return new PlayerScoreState(dto);
    }

    public PlayerScoreStateDTO toJson() {
        return new PlayerScoreStateDTO(this);
    }
    public List<MilestonesEnum> getClaimedMilestone() {
        return claimedMilestone;
    }
    public void setClaimedMilestone(List<MilestonesEnum> claimedMilestone) {
        this.claimedMilestone = claimedMilestone;
    }   
}
