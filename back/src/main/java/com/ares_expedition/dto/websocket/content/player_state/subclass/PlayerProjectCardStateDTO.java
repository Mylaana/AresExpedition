package com.ares_expedition.dto.websocket.content.player_state.subclass;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.ares_expedition.dto.websocket.content.player_state.subclass.substates.TriggerStateDTO;
import com.ares_expedition.model.player_state.subclass.PlayerProjectCardState;
import com.fasterxml.jackson.annotation.JsonProperty;

public class PlayerProjectCardStateDTO {
    @JsonProperty("h")
    private List<Integer> hand = new ArrayList<>();
    @JsonProperty("hc")
    private List<Integer> handCorporations = new ArrayList<>();
    @JsonProperty("hd")
    private List<Integer> handDiscard = new ArrayList<>();
    @JsonProperty("ppil")
    private List<Integer> playedProjectIdList = new ArrayList<>();
    @JsonProperty("cp")
    private List<Map<Integer, Object>> cardPlayed = new ArrayList<>();
    @JsonProperty("t")
    private TriggerStateDTO triggers = new TriggerStateDTO();
    @JsonProperty("hms")
    private Integer handMaximumSize;

    PlayerProjectCardStateDTO() {
    }

    public PlayerProjectCardStateDTO(PlayerProjectCardState state) {
        this.hand = state.getHand();
        this.handCorporations = state.getHandCorporations();
        this.handDiscard = state.getHandDiscard();
        this.triggers = state.getTriggers().toJson();
        this.handMaximumSize = state.getHandMaximumSize();
        this.cardPlayed = state.getCardPlayed();
    }

    public List<Integer> getHand() {
        return this.hand;
    }

    public void setHand(List<Integer> hand) {
        this.hand = hand;
    }

    public List<Integer> getPlayedProjectIdList() {
        return this.playedProjectIdList;
    }

    public void setPlayedProjectIdList(List<Integer> playedProjectIdList) {
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

    public List<Integer> getHandCorporations() {
        return handCorporations;
    }

    public void setHandCorporations(List<Integer> handCorporations) {
        this.handCorporations = handCorporations;
    }

    public List<Integer> getHandDiscard() {
        return handDiscard;
    }

    public void setHandDiscard(List<Integer> handDiscard) {
        this.handDiscard = handDiscard;
    }

    public List<Map<Integer, Object>> getCardPlayed() {
        return cardPlayed;
    }

    public void setCardPlayed(List<Map<Integer, Object>> cardPlayed) {
        this.cardPlayed = cardPlayed;
    }
}
