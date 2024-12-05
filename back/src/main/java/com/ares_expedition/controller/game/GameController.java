package com.ares_expedition.controller.game;

import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.ares_expedition.controller.websocket.WsControllerOutput;
import com.ares_expedition.dto.websocket.messages.answer.PlayerMessageAnswer;
import com.ares_expedition.dto.websocket.messages.answer.content.GameStateContent;
import com.ares_expedition.enums.game.PhaseEnum;
import com.ares_expedition.model.game.PlayerState;
import com.ares_expedition.repository.Game;
import com.ares_expedition.repository.JsonGameReader;

@Service
public class GameController {
    private final WsControllerOutput wsOutput;
    private Map<Integer, Game> gameHolder;

    public GameController(WsControllerOutput wsOutput){
        this.wsOutput = wsOutput;
        this.loadGames();
    }
    private void loadGames(){
        this.gameHolder = new HashMap<>();
        Integer gameId = 1;
        Game newGame = JsonGameReader.getGame(gameId);
        newGame.shuffleDeck();
        this.gameHolder.put(gameId, newGame);
    }
    public Game getGameFromId(Integer gameId){
        return this.gameHolder.get(gameId);
    }
    public List<Integer> drawCards(Integer gameId, Integer drawNumber){
        List<Integer> cards = getGameFromId(gameId).drawCards(drawNumber);
        if(cards.size() < drawNumber){
            wsOutput.sendPushToGroup(new PlayerMessageAnswer(gameId, "not enough cards in deck"));
        }
        return cards;
    }
    public void setPlayerReady(Integer gameId, Integer playerId, Boolean ready){
        getGameFromId(gameId).setPlayerReady(playerId, ready);
    }
    public Map<Integer, Boolean> getGroupPlayerReady(Integer gameId){
        return getGameFromId(gameId).getGroupPlayerReady();
    }
    public Boolean getAllPlayersReady(Integer gameId){
        Boolean allPlayersReady = true;
        Map<Integer, Boolean> readyMap = getGroupPlayerReady(gameId);
        for(Map.Entry<Integer, Boolean> entry : readyMap.entrySet()){
            if(!entry.getValue()){
                allPlayersReady = false;
                break;
            }
        };
        return allPlayersReady;
    }
    public void setAllPlayersNotReady(Integer gameId){
        getGameFromId(gameId).setAllPlayersNotReady();
    }
    public GameStateContent getGameState(Integer gameId){
        return getGameFromId(gameId).getGameState();
    }
    public void nextPhaseSelected(Integer gameId){
        getGameFromId(gameId).nextPhaseSelected();
    }
    public void addPhaseSelected(Integer gameId, PhaseEnum phase){
        getGameFromId(gameId).addPhaseSelected(phase);
    }
    public LinkedHashSet<PhaseEnum> getPhaseSelected(Integer gameId){
        return getGameFromId(gameId).getPhaseSelected();
    }
    public void setPlayerState(Integer gameId, Integer playerId, PlayerState state){
        getGameFromId(gameId).setPlayerState(playerId, state);
    }
}
