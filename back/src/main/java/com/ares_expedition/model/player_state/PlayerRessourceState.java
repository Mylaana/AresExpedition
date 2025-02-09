package com.ares_expedition.model.player_state;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.ares_expedition.dto.websocket.content.player_state.PlayerRessourceStateDTO;

public class PlayerRessourceState {
    private List<Map<String, Object>> ressource = new ArrayList<>();

    PlayerRessourceState() {
    }

    public PlayerRessourceState(PlayerRessourceStateDTO dto) {
        this.ressource = dto.getRessource();
    }

    public List<Map<String, Object>> getRessource() {
        return ressource;
    }

    public void setRessource(List<Map<String, Object>> ressource) {
        this.ressource = ressource;
    }
    
    public static PlayerRessourceState fromJson(PlayerRessourceStateDTO dto) {
        return new PlayerRessourceState(dto);
    }

    public PlayerRessourceStateDTO toJson() {
        return new PlayerRessourceStateDTO(this);
    }
}
