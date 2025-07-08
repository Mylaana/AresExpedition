package com.ares_expedition.model.player_state.subclass;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.ares_expedition.dto.websocket.content.player_state.subclass.PlayerProjectCardStateDTO;
import com.ares_expedition.model.player_state.subclass.substates.TriggerState;

public class PlayerProjectCardState {
    private List<String> hand = new ArrayList<>();
    private List<String> handCorporations = new ArrayList<>();
    private List<String> handDiscard = new ArrayList<>();
    private Map<String, Object> cardPlayed = new HashMap<>();
    private TriggerState triggers = new TriggerState();
    private Integer handMaximumSize = 10;
    private Map<String, Integer> prerequisiteOffset = new HashMap<>();

    public PlayerProjectCardState() {
    }

    public PlayerProjectCardState(PlayerProjectCardStateDTO dto) {
        this.hand = dto.getHand();
        this.handCorporations = dto.getHandCorporations();
        this.handDiscard = dto.getHandDiscard();
        this.cardPlayed = dto.getCardPlayed();
        this.triggers = TriggerState.fromJson(dto.getTriggers());
        this.handMaximumSize = dto.getHandMaximumSize();
        this.prerequisiteOffset = dto.getPrerequisiteOffset();
    }

    public List<String> getHand() {
        return hand;
    }

    public void setHand(List<String> hand) {
        this.hand = hand;
    }

    public TriggerState getTriggers() {
        return triggers;
    }

    public void setTriggers(TriggerState triggers) {
        this.triggers = triggers;
    }

    public Integer getHandMaximumSize() {
        return handMaximumSize;
    }

    public void setHandMaximumSize(Integer handMaximumSize) {
        this.handMaximumSize = handMaximumSize;
    }

    public static PlayerProjectCardState fromJson(PlayerProjectCardStateDTO dto) {
        return new PlayerProjectCardState(dto);
    }

    public PlayerProjectCardStateDTO toJson() {
        return new PlayerProjectCardStateDTO(this);
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

    public Map<String, Object> getCardPlayed() {
        return cardPlayed;
    }

    public void setCardPlayed(Map<String, Object> cardPlayed) {
        this.cardPlayed = cardPlayed;
    }

    public Map<String, Integer> getPrerequisiteOffset() {
        return prerequisiteOffset;
    }

    public void setPrerequisiteOffset(Map<String, Integer> prerequisiteOffset) {
        this.prerequisiteOffset = prerequisiteOffset;
    }
}
