package com.ares_expedition.model.player_state;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.ares_expedition.dto.websocket.content.player_state.subclass.PlayerProjectCardStateDTO;

public class PlayerProjectCardState {
    private List<Integer> hand = new ArrayList<>();
    private List<Integer> playedProjectIdList = new ArrayList<>();
    private Map<Integer, Object> playedProjectCardStocks = new HashMap<Integer, Object>();
    private Map<String, Object> triggers = new HashMap<String, Object>();
    private Integer handMaximumSize;

    PlayerProjectCardState() {
    }

    public PlayerProjectCardState(PlayerProjectCardStateDTO dto) {
        this.hand = dto.getHand();
        this.playedProjectIdList = dto.getPlayedProjectIdList();
        this.playedProjectCardStocks = dto.getPlayedProjectCardStocks();
        this.triggers = dto.getTriggers();
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

    public Map<String, Object> getTriggers() {
        return triggers;
    }

    public void setTriggers(Map<String, Object> triggers) {
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
}
