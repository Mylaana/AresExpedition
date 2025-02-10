package com.ares_expedition.dto.websocket.content.player_state.subclass;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.ares_expedition.model.player_state.PlayerRessourceState;

public class PlayerRessourceStateDTO {
    private List<Map<String, Object>> ressources = new ArrayList<>();

    PlayerRessourceStateDTO() {
    }
    
    public PlayerRessourceStateDTO(PlayerRessourceState state) {
        this.ressources = state.getRessources();
    }

    public List<Map<String, Object>> getRessources() {
        return ressources;
    }

    public void setRessources(List<Map<String, Object>> ressource) {
        this.ressources = ressource;
    }
}
