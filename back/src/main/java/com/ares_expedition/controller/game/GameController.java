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
import com.ares_expedition.model.core.Ocean;
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
        this.onAllPlayersReady(game);
    }
    
    public void goToNextPhase(Game game){
        game.setAllPlayersNotReady();
        game.nextPhaseSelected();
        game.applyGlobalParameterIncreaseEop();
        game.fillDiscardPileFromPlayerDiscard();
        if(game.getCurrentPhase()==PhaseEnum.PRODUCTION){
            game.applyDrawProduction();
        }
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
        JsonGameDataHandler.saveGame(game);
    }

    public void setPlayerState(String gameId, String playerId, PlayerState state, Boolean setPlayerReady){
        Game game = getGameFromId(gameId);
        game.setPlayerState(playerId, state);
        this.setPlayerReady(game.getGameId(), playerId, setPlayerReady);
        JsonGameDataHandler.saveGame(game);
    }

    public GameStatusEnum getGameStatus(String gameId) {
        return getGameFromId(gameId).getGameStatus();
    }

    public void setGameStatus(String gameId, GameStatusEnum status) {
        getGameFromId(gameId).setGameStatus(status);
    }

    public void onAllPlayersReady(Game game) {
        switch (game.getGameStatus()) {
            case NEW_GAME:
                game.setAllPlayersNotReady();
                game.setStartingHand();
                game.setStartingHandCorporations();
                game.setGameStatus(GameStatusEnum.SELECT_STARTING_HAND);
                wsOutput.sendPushToGroup(MessageOutputFactory.createSelectStartingHandMessage(game.getGameId(), game.getGameState()));
                break;

            case SELECT_STARTING_HAND:
                game.setAllPlayersNotReady();
                game.setGameStatus(GameStatusEnum.SELECT_CORPORATION);
                wsOutput.sendPushToGroup(MessageOutputFactory.createSelectCorporationMessage(game.getGameId(), game.getGameState()));
                break;

            case SELECT_CORPORATION:
            game.setGameStatus(GameStatusEnum.STARTED);
                this.goToNextPhase(game);
                break;

            case STARTED:
                this.goToNextPhase(game);
                break;

            default:
                break;
        }
        JsonGameDataHandler.saveGame(game);
    }

    public void flipOceans(String gameId, String playerId, Integer oceanNumber, PlayerState playerState){
        Game game = getGameFromId(gameId);
        List<Ocean> oceans = game.flipOceans(oceanNumber);
        playerState.addEventOceans(oceans);
        List<Integer> cardsToDraw = game.drawFlippedOceanCards(playerId, oceans);
        if(cardsToDraw.size()>0){
            playerState.addEventDrawCards(cardsToDraw); 
        }
        game.setPlayerState(playerId, playerState);
        JsonGameDataHandler.saveGame(game);
        wsOutput.sendPushToPlayer(MessageOutputFactory.createOceanFlippedMessage(gameId, oceans, cardsToDraw), playerId);
    }
}
