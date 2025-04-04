package com.ares_expedition.controller.game;

import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.ares_expedition.controller.websocket.WsControllerOutput;
import com.ares_expedition.dto.websocket.messages.output.BaseMessageOutputDTO;
import com.ares_expedition.dto.websocket.messages.output.GameStateMessageOutputDTO;
import com.ares_expedition.enums.game.GameStatusEnum;
import com.ares_expedition.enums.game.PhaseEnum;
import com.ares_expedition.model.core.Game;
import com.ares_expedition.model.factory.MessageOutputFactory;
import com.ares_expedition.model.player_state.PlayerState;
import com.ares_expedition.repository.JsonGameDataHandler;

@Service
public class GameController {
    private final WsControllerOutput wsOutput;
    private Map<String, Game> gameHolder = new HashMap<>();

    public GameController(WsControllerOutput wsOutput){
        this.wsOutput = wsOutput;
        this.loadGames();
    }
    
    private void loadGames(){
        this.gameHolder = JsonGameDataHandler.getAllGames();
    }

    public void loadGame(String gameId){
        this.gameHolder.put(gameId, JsonGameDataHandler.getGame(gameId));
    }

    public Game getGameFromId(String gameId){
        System.out.print(gameHolder);
        return this.gameHolder.get(gameId);
    }

    public List<Integer> drawCards(String gameId, Integer drawNumber){
        List<Integer> cards = getGameFromId(gameId).drawCards(drawNumber);
        if(cards.size() < drawNumber){
            wsOutput.sendPushToGroup(new BaseMessageOutputDTO(gameId, "not enough cards in deck"));
        }
        return cards;
    }

    public void setPlayerReady(String gameId, String playerId, Boolean ready){
        Game game = getGameFromId(gameId);
        game.setPlayerReady(playerId, ready);

        //check if all players are ready and act
        if(!game.getAllPlayersReady()){
            wsOutput.sendPushToGroup(MessageOutputFactory.createPlayerReadyMessage(gameId, game.getGroupPlayerReady()));
            return;
        }
        this.goToNextPhase(game);
    }
    
    public void goToNextPhase(Game game){
        game.setAllPlayersNotReady();
        game.nextPhaseSelected();
        game.applyGlobalParameterIncreaseEop();
        wsOutput.sendPushToGroup(MessageOutputFactory.createNextPhaseMessage(game.getGameId(), game.getGameState()));
    }

    public Map<String, Boolean> getGroupPlayerReady(String gameId){
        return getGameFromId(gameId).getGroupPlayerReady();
    }

    public Boolean getAllPlayersReady(String gameId){
        return  getGameFromId(gameId).getAllPlayersReady();
    }

    public void setAllPlayersNotReady(String gameId){
        getGameFromId(gameId).setAllPlayersNotReady();
    }

    public GameStateMessageOutputDTO getGameState(String gameId){
        return getGameFromId(gameId).getGameState();
    }

    public void nextPhaseSelected(String gameId){
        getGameFromId(gameId).nextPhaseSelected();
    }

    public void addPhaseSelected(String gameId, PhaseEnum phase){
        getGameFromId(gameId).addPhaseSelected(phase);
    }

    public LinkedHashSet<PhaseEnum> getPhaseSelected(String gameId){
        return getGameFromId(gameId).getPhaseSelected();
    }

    public void setPlayerState(String gameId, String playerId, PlayerState state){
        Game game = getGameFromId(gameId);
        game.setPlayerState(playerId, state);
        this.setPlayerReady(gameId, playerId, true);
    }

    public GameStatusEnum getGameStatus(String gameId) {
        return getGameFromId(gameId).getgameStatus();
    }

    public void setGameStatus(String gameId, GameStatusEnum status) {
        getGameFromId(gameId).setgameStatus(status);
    }
}
