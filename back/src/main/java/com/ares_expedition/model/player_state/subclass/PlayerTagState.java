package com.ares_expedition.model.player_state.subclass;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.ares_expedition.dto.websocket.content.player_state.subclass.PlayerTagStateDTO;

public class PlayerTagState {
    private List<Map<String, Object>> tags = new ArrayList<>();

    public PlayerTagState() {
    }
    PlayerTagState(PlayerTagStateDTO dto) {
        this.tags = dto.getTags();
    }
    public List<Map<String, Object>> getTags() {
        return tags;
    }

    public void setTags(List<Map<String, Object>> tags) {
        this.tags = tags;
    }

    public static PlayerTagState fromJson(PlayerTagStateDTO dto) {
        return new PlayerTagState(dto);
    }

    public PlayerTagStateDTO toJson() {
        return new PlayerTagStateDTO(this);
    }
}
