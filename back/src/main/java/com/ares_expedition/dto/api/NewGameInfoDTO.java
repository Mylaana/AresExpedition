package com.ares_expedition.dto.api;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.ares_expedition.enums.game.GameContentNameEnum;
import com.ares_expedition.model.core.subModel.GameOption;

public class NewGameInfoDTO {
    String gameId;
    Map<GameContentNameEnum, GameOption> options;
    List<CreatePlayerDTO> players = new ArrayList<>();

    NewGameInfoDTO(){
    }
    public NewGameInfoDTO(String gameId, List<CreatePlayerDTO> players, Map<GameContentNameEnum, GameOption> options) {
        this.players = players;
        this.options = options;
        this.gameId = gameId;
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
    public List<CreatePlayerDTO> getPlayers() {
        return players;
    }
    public void setPlayers(List<CreatePlayerDTO> players) {
        this.players = players;
    }
}
