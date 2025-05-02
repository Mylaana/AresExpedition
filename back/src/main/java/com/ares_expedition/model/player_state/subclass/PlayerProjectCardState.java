package com.ares_expedition.model.player_state.subclass;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.ares_expedition.dto.websocket.content.player_state.subclass.PlayerProjectCardStateDTO;
import com.ares_expedition.model.player_state.subclass.substates.TriggerState;

public class PlayerProjectCardState {
    private List<Integer> hand = new ArrayList<>();
    private List<Integer> handCorporations = new ArrayList<>();
    private List<Integer> handDiscard = new ArrayList<>();
    private List<Integer> playedProjectIdList = new ArrayList<>();
    private Map<Integer, Object> playedProjectCardStocks = new HashMap<Integer, Object>();
    private TriggerState triggers = new TriggerState();
    private Integer handMaximumSize = 10;

    public PlayerProjectCardState() {
    }

    public PlayerProjectCardState(PlayerProjectCardStateDTO dto) {
        this.hand = dto.getHand();
        this.handCorporations = dto.getHandCorporations();
        this.handDiscard = dto.getHandDiscard();
        this.playedProjectIdList = dto.getPlayedProjectIdList();
        this.playedProjectCardStocks = dto.getPlayedProjectCardStocks();
        this.triggers = TriggerState.fromJson(dto.getTriggers());
        this.handMaximumSize = dto.getHandMaximumSize();
    }

    public List<Integer> getHand() {
        return hand;
    }

    public void setHand(List<Integer> hand) {
        this.hand = hand;
    }

    public List<Integer> getPlayedProjectIdList() {
        return playedProjectIdList;
    }

    public void setPlayedProjectIdList(List<Integer> playedProjectIdList) {
        this.playedProjectIdList = playedProjectIdList;
    }

    public Map<Integer, Object> getPlayedProjectCardStocks() {
        return playedProjectCardStocks;
    }

    public void setPlayedProjectCardStocks(Map<Integer, Object> projectCardStocks) {
        this.playedProjectCardStocks = projectCardStocks;
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
    
}
