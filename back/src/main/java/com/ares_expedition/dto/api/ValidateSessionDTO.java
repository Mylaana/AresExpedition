package com.ares_expedition.dto.api;

public class ValidateSessionDTO {
    String gameId;
    String playerId;

    ValidateSessionDTO(){}

    public String getGameId() {
        return gameId;
    }

    public void setGameId(String gameId) {
        this.gameId = gameId;
    }

    public String getPlayerId() {
        return playerId;
    }

    public void setPlayerId(String playerId) {
        this.playerId = playerId;
    }
}
