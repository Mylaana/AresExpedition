package com.ares_expedition.controller.game;

import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;

import com.ares_expedition.controller.websocket.WsControllerOutput;
import com.ares_expedition.dto.websocket.PlayerMessageAnswer;
import com.ares_expedition.model.query.player.GroupPlayerReadyQuery;
import com.ares_expedition.repository.Game;
import com.ares_expedition.repository.JsonGameReader;

@Service
public class GameController {
    private final WsControllerOutput wsOutput;
    List<Game> gameHolder;

    GameController(WsControllerOutput wsOutput){
        this.wsOutput = wsOutput;
        this.loadGames();
    }
    private void loadGames(){
        this.gameHolder = new ArrayList<>();
        Game newGame = JsonGameReader.getGame(1);
        newGame.shuffleDeck();
        this.gameHolder.add(newGame);
    }
    public List<Integer> drawCards(Integer gameId, Integer drawNumber){
        List<Integer> cards = this.gameHolder.get(0).drawCards(drawNumber);
        if(cards.size() < drawNumber){
            wsOutput.sendPushToGroup(gameId, new PlayerMessageAnswer("not enough cards in deck"));
        }
        return cards;
    }
    public void setPlayerReady(Integer gameId, Integer playerId){

    }
    public GroupPlayerReadyQuery getPlayerReady(Integer gameId){
        GroupPlayerReadyQuery ready = new GroupPlayerReadyQuery();

        //...

        return ready;
    }
}
