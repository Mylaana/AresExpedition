package com.ares_expedition.dto.websocket.content.player_state.subclass;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.ares_expedition.model.player_state.PlayerTagState;
import com.fasterxml.jackson.annotation.JsonProperty;

public class PlayerTagStateDTO {
    @JsonProperty("t")
    private List<Map<String, Object>> tags = new ArrayList<>();

    PlayerTagStateDTO() {
    }
    
    public PlayerTagStateDTO(PlayerTagState state) {
        this.tags = state.getTags();
    }

    public List<Map<String, Object>> getTags() {
        return tags;
    }

    public void setTag(List<Map<String, Object>> tags) {
        this.tags = tags;
    }
}
