
package com.ares_expedition.model.player_state;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.ares_expedition.dto.websocket.content.player_state.subclass.PlayerRessourceStateDTO;

public class PlayerRessourceState {
    private List<Map<String, Object>> ressources = new ArrayList<>();

    PlayerRessourceState() {
    }

    public PlayerRessourceState(PlayerRessourceStateDTO dto) {
        this.ressources = dto.getRessources();
    }

    public List<Map<String, Object>> getRessources() {
        return ressources;
    }

    public void setRessources(List<Map<String, Object>> ressource) {
        this.ressources = ressource;
    }
    
    public static PlayerRessourceState fromJson(PlayerRessourceStateDTO dto) {
        return new PlayerRessourceState(dto);
    }

    public PlayerRessourceStateDTO toJson() {
        return new PlayerRessourceStateDTO(this);
    }
}
