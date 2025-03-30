package com.ares_expedition.dto.api;

import java.util.List;
import java.util.Map;

public class NewGameConfigDTO {
    private String gameId;
    private List<CreatePlayerDTO> players;
    private Map<String, Object> options;

    public NewGameConfigDTO() {}

    public NewGameConfigDTO(String gameId, List<CreatePlayerDTO> players, Map<String, Object> gameMode) {
        this.gameId = gameId;
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

    public String getGameId() {
        return gameId;
    }

    public void setGameId(String gameId) {
        this.gameId = gameId;
    }
}