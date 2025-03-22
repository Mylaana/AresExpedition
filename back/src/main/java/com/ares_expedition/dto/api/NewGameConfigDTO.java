package com.ares_expedition.dto.api;

public class NewGameConfigDTO {

    private int maxPlayers;
    private String gameMode;

    // Constructeurs
    public NewGameConfigDTO() {}

    public NewGameConfigDTO(int maxPlayers, String gameMode) {
        this.maxPlayers = maxPlayers;
        this.gameMode = gameMode;
    }

    // Getters et setters
    public int getMaxPlayers() {
        return maxPlayers;
    }

    public void setMaxPlayers(int maxPlayers) {
        this.maxPlayers = maxPlayers;
    }

    public String getGameMode() {
        return gameMode;
    }

    public void setGameMode(String gameMode) {
        this.gameMode = gameMode;
    }
}