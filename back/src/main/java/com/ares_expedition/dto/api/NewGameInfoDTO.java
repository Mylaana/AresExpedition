package com.ares_expedition.dto.api;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class NewGameInfoDTO {
    String gameId;
    Map<String, Object> options;
    List<CreatePlayerDTO> players = new ArrayList<>();

    NewGameInfoDTO(){
    }
    public NewGameInfoDTO(List<CreatePlayerDTO> players){
        this.players = players;
    }
    public NewGameInfoDTO(String gameId, List<CreatePlayerDTO> players, Map<String, Object> options) {
        this.players = players;
        this.options = options;
        this.gameId = gameId;
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
    public List<CreatePlayerDTO> getPlayers() {
        return players;
    }
    public void setPlayers(List<CreatePlayerDTO> players) {
        this.players = players;
    }
    
}
