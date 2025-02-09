package com.ares_expedition.dto.websocket.content.player_state;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.ares_expedition.model.player_state.PlayerTagState;

public class PlayerTagStateDTO {
    private List<Map<String, Object>> tag = new ArrayList<>();

    PlayerTagStateDTO() {
    }
    public PlayerTagStateDTO(PlayerTagState state) {
        this.tag = state.getTag();
    }
    public List<Map<String, Object>> getTag() {
        return tag;
    }

    public void setTag(List<Map<String, Object>> tag) {
        this.tag = tag;
    }
}
