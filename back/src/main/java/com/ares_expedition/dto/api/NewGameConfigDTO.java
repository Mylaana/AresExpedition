package com.ares_expedition.dto.api;

import java.util.Map;

public class NewGameConfigDTO {

    private Map<String, String> players;
    private String gameMode;

    public NewGameConfigDTO() {}

    public NewGameConfigDTO(Map<String, String> players, String gameMode) {
        this.players = players;
        this.gameMode = gameMode;
    }

    public String getGameMode() {
        return gameMode;
    }

    public void setGameMode(String gameMode) {
        this.gameMode = gameMode;
    }

    public Map<String, String> getPlayers() {
        return players;
    }

    public void setPlayers(Map<String, String> players) {
        this.players = players;
    }

    
}