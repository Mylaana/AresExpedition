package com.ares_expedition.controller.game;

import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.ares_expedition.controller.websocket.WsControllerOutput;
import com.ares_expedition.dto.websocket.messages.output.BaseMessageOutputDTO;
import com.ares_expedition.dto.websocket.messages.output.GameStateMessageOutputDTO;
import com.ares_expedition.enums.game.PhaseEnum;
import com.ares_expedition.model.factory.MessageOutputFactory;
import com.ares_expedition.model.game.PlayerState;
import com.ares_expedition.repository.Game;
import com.ares_expedition.repository.JsonGameReader;

@Service
public class GameController {
    private final WsControllerOutput wsOutput;
    private Map<Integer, Game> gameHolder = new HashMap<>();

    public GameController(WsControllerOutput wsOutput){
        this.wsOutput = wsOutput;
        this.loadGames();
    }
    private void loadGames(){
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
            wsOutput.sendPushToGroup(new BaseMessageOutputDTO(gameId, "not enough cards in deck"));
        }
        return cards;
    }
    public void setPlayerReady(Integer gameId, Integer playerId, Boolean ready){
        Game game = getGameFromId(gameId);
        game.setPlayerReady(playerId, ready);

        //check if all players are ready and act
        if(!game.getAllPlayersReady()){
            System.out.println("\u001B[32m NOT ALL READY, STOPPING" +  "\u001B[0m");
            wsOutput.sendPushToGroup(MessageOutputFactory.createPlayerReadyMessage(gameId, game.getGroupPlayerReady()));
            return;
        }

        System.out.println("\u001B[32m GOING THROUGH" +  "\u001B[0m");
        game.setAllPlayersNotReady();
        game.nextPhaseSelected();
        wsOutput.sendPushToGroup(MessageOutputFactory.createNextPhaseMessage(gameId, game.getGameState()));
    }
    public Map<Integer, Boolean> getGroupPlayerReady(Integer gameId){
        return getGameFromId(gameId).getGroupPlayerReady();
    }
    public Boolean getAllPlayersReady(Integer gameId){
        return  getGameFromId(gameId).getAllPlayersReady();
    }
    public void setAllPlayersNotReady(Integer gameId){
        getGameFromId(gameId).setAllPlayersNotReady();
    }
    public GameStateMessageOutputDTO getGameState(Integer gameId){
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
        Game game = getGameFromId(gameId);
        game.setPlayerState(playerId, state);
        this.setPlayerReady(gameId, playerId, true);
    }
}
