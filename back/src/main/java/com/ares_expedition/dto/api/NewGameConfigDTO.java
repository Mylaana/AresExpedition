package com.ares_expedition.dto.api;

import java.util.List;
import java.util.Map;

import com.ares_expedition.enums.game.GameContentNameEnum;
import com.ares_expedition.model.core.subModel.GameOption;

public class NewGameConfigDTO {
    private String gameId;
    private List<CreatePlayerDTO> players;
    private Map<GameContentNameEnum, GameOption> options;

    public NewGameConfigDTO() {}

    public NewGameConfigDTO(String gameId, List<CreatePlayerDTO> players, Map<GameContentNameEnum, GameOption> gameMode) {
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

    public Map<GameContentNameEnum, GameOption> getOptions() {
        return options;
    }

    public void setOptions(Map<GameContentNameEnum, GameOption> options) {
        this.options = options;
    }

    public String getGameId() {
        return gameId;
    }

    public void setGameId(String gameId) {
        this.gameId = gameId;
    }
}