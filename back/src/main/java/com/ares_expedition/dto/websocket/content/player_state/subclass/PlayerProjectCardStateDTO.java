package com.ares_expedition.dto.websocket.content.player_state.subclass;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.ares_expedition.model.player_state.PlayerProjectCardState;

public class PlayerProjectCardStateDTO {
    private List<Integer> hand = new ArrayList<>();
    private List<Integer> playedProjectIdList = new ArrayList<>();
    private Map<Integer, Object> playedProjectCardStocks = new HashMap<Integer, Object>();
    private Map<String, Object> triggers = new HashMap<String, Object>();
    private Integer handMaximumSize;

    PlayerProjectCardStateDTO() {
    }

    public PlayerProjectCardStateDTO(PlayerProjectCardState state) {
        this.hand = state.getHand();
        this.playedProjectIdList = state.getPlayedProjectIdList();
        this.playedProjectCardStocks = state.getPlayedProjectCardStocks();
        this.triggers = state.getTriggers();
        this.handMaximumSize = state.getHandMaximumSize();
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

    public Map<Integer, Object> getPlayedProjectCardStocks() {
        return this.playedProjectCardStocks;
    }

    public void setPlayedProjectCardStocks(Map<Integer, Object> projectCardStocks) {
        this.playedProjectCardStocks = projectCardStocks;
    }

    public Map<String, Object> getTriggers() {
        return this.triggers;
    }

    public void setTriggers(Map<String, Object> triggers) {
        this.triggers = triggers;
    }

    public Integer getHandMaximumSize() {
        return this.handMaximumSize;
    }

    public void setHandMaximumSize(Integer handMaximumSize) {
        this.handMaximumSize = handMaximumSize;
    }
}
