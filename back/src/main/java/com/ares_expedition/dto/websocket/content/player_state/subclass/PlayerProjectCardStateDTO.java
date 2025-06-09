package com.ares_expedition.dto.websocket.content.player_state.subclass;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.ares_expedition.dto.websocket.content.player_state.subclass.substates.TriggerStateDTO;
import com.ares_expedition.model.player_state.subclass.PlayerProjectCardState;
import com.fasterxml.jackson.annotation.JsonProperty;

public class PlayerProjectCardStateDTO {
    @JsonProperty("h")
    private List<String> hand = new ArrayList<>();
    @JsonProperty("hc")
    private List<String> handCorporations = new ArrayList<>();
    @JsonProperty("hd")
    private List<String> handDiscard = new ArrayList<>();
    @JsonProperty("ppil")
    private List<String> playedProjectIdList = new ArrayList<>();
    @JsonProperty("cp")
    private List<Map<String, Object>> cardPlayed = new ArrayList<>();
    @JsonProperty("t")
    private TriggerStateDTO triggers = new TriggerStateDTO();
    @JsonProperty("hms")
    private Integer handMaximumSize;
    @JsonProperty("o")
    private Map<String, Integer> prerequisiteOffset = new HashMap<>();

    PlayerProjectCardStateDTO() {
    }

    public PlayerProjectCardStateDTO(PlayerProjectCardState state) {
        this.hand = state.getHand();
        this.handCorporations = state.getHandCorporations();
        this.handDiscard = state.getHandDiscard();
        this.triggers = state.getTriggers().toJson();
        this.handMaximumSize = state.getHandMaximumSize();
        this.cardPlayed = state.getCardPlayed();
        this.prerequisiteOffset = state.getPrerequisiteOffset();
    }

    public List<String> getHand() {
        return this.hand;
    }

    public void setHand(List<String> hand) {
        this.hand = hand;
    }

    public List<String> getPlayedProjectIdList() {
        return this.playedProjectIdList;
    }

    public void setPlayedProjectIdList(List<String> playedProjectIdList) {
        this.playedProjectIdList = playedProjectIdList;
    }

    public TriggerStateDTO getTriggers() {
        return this.triggers;
    }

    public void setTriggers(TriggerStateDTO triggers) {
        this.triggers = triggers;
    }

    public Integer getHandMaximumSize() {
        return this.handMaximumSize;
    }

    public void setHandMaximumSize(Integer handMaximumSize) {
        this.handMaximumSize = handMaximumSize;
    }

    public List<String> getHandCorporations() {
        return handCorporations;
    }

    public void setHandCorporations(List<String> handCorporations) {
        this.handCorporations = handCorporations;
    }

    public List<String> getHandDiscard() {
        return handDiscard;
    }

    public void setHandDiscard(List<String> handDiscard) {
        this.handDiscard = handDiscard;
    }

    public List<Map<String, Object>> getCardPlayed() {
        return cardPlayed;
    }

    public void setCardPlayed(List<Map<String, Object>> cardPlayed) {
        this.cardPlayed = cardPlayed;
    }

    public Map<String, Integer> getPrerequisiteOffset() {
        return prerequisiteOffset;
    }

    public void setPrerequisiteOffset(Map<String, Integer> prerequisiteOffset) {
        this.prerequisiteOffset = prerequisiteOffset;
    }
}
