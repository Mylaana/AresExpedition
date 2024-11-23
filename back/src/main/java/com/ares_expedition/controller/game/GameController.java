package com.ares_expedition.controller.game;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.ares_expedition.controller.websocket.WsControllerOutput;
import com.ares_expedition.dto.websocket.serialized_message.answer.GameStateMessage;
import com.ares_expedition.dto.websocket.serialized_message.answer.PlayerMessageAnswer;
import com.ares_expedition.repository.Game;
import com.ares_expedition.repository.JsonGameReader;

@Service
public class GameController {
    private final WsControllerOutput wsOutput;
    private Map<Integer, Game> gameHolder;

    GameController(WsControllerOutput wsOutput){
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
    public GameStateMessage getGameState(Integer gameId){
        return getGameFromId(gameId).getGameState();
    }
}
