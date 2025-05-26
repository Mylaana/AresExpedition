
package com.ares_expedition.model.player_state.subclass;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.ares_expedition.dto.websocket.content.player_state.subclass.PlayerRessourceStateDTO;
import com.fasterxml.jackson.annotation.JsonIgnore;

public class PlayerRessourceState {
    private List<Map<String, Object>> ressources = new ArrayList<>();

    public PlayerRessourceState() {
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

    @JsonIgnore
    public Integer getCardsProduction() {
        for(Map<String, Object> ressource: this.ressources){
            if(ressource.get("name").equals("card")){
                System.out.print("CARDS PRODUCTION: " + ressource.get("valueStock"));
                return (Integer) ressource.get("valueProd");
            }
        }
        return 0;
    }
    
    public static PlayerRessourceState fromJson(PlayerRessourceStateDTO dto) {
        return new PlayerRessourceState(dto);
    }

    public PlayerRessourceStateDTO toJson() {
        return new PlayerRessourceStateDTO(this);
    }
}
