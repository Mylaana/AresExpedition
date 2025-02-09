package com.ares_expedition.dto.websocket.content.player_state;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.ares_expedition.model.player_state.PlayerRessourceState;

public class PlayerRessourceStateDTO {
    private List<Map<String, Object>> ressource = new ArrayList<>();

    PlayerRessourceStateDTO() {
    }
    
    public PlayerRessourceStateDTO(PlayerRessourceState state) {
        this.ressource = state.getRessource();
    }

    public List<Map<String, Object>> getRessource() {
        return ressource;
    }

    public void setRessource(List<Map<String, Object>> ressource) {
        this.ressource = ressource;
    }
}
