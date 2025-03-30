package com.ares_expedition.dto.api;

import java.util.List;
import java.util.Map;

public class NewGameConfigDTO {

    private List<CreatePlayerDTO> players;
    private Map<String, Object> options;

    public NewGameConfigDTO() {}

    public NewGameConfigDTO(List<CreatePlayerDTO> players, Map<String, Object> gameMode) {
        this.players = players;
        this.options = gameMode;
    }

    public List<CreatePlayerDTO> getPlayers() {
        return players;
    }

    public void setPlayers(List<CreatePlayerDTO> players) {
        this.players = players;
    }

    public Map<String, Object> getOptions() {
        return options;
    }

    public void setOptions(Map<String, Object> options) {
        this.options = options;
    }

    
}