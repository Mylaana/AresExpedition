package com.ares_expedition.model.player_state;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.ares_expedition.dto.websocket.content.player_state.PlayerTagStateDTO;

public class PlayerTagState {
    private List<Map<String, Object>> tag = new ArrayList<>();

    PlayerTagState() {
    }
    PlayerTagState(PlayerTagStateDTO dto) {
        this.tag = dto.getTag();
    }
    public List<Map<String, Object>> getTag() {
        return tag;
    }

    public void setTag(List<Map<String, Object>> tag) {
        this.tag = tag;
    }

    public static PlayerTagState fromJson(PlayerTagStateDTO dto) {
        return new PlayerTagState(dto);
    }

    public PlayerTagStateDTO toJson() {
        return new PlayerTagStateDTO(this);
    }
}
