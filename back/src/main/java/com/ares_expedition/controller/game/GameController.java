package com.ares_expedition.controller.game;

import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.ares_expedition.controller.websocket.WsControllerOutput;
import com.ares_expedition.dto.websocket.messages.output.BaseMessageOutputDTO;
import com.ares_expedition.dto.websocket.messages.output.GameStateMessageOutputDTO;
import com.ares_expedition.enums.game.GameStatusEnum;
import com.ares_expedition.enums.game.PhaseEnum;
import com.ares_expedition.enums.game.ScanKeepOptionsEnum;
import com.ares_expedition.enums.websocket.ContentQueryEnum;
import com.ares_expedition.model.core.Game;
import com.ares_expedition.model.core.Ocean;
import com.ares_expedition.model.factory.MessageOutputFactory;
import com.ares_expedition.model.player_state.PlayerState;
import com.ares_expedition.repository.JsonGameDataHandler;

@Service
public class GameController {
    private static final Logger logger = LoggerFactory.getLogger(GameController.class);
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
        return this.gameHolder.get(gameId);
    }

    private List<String> cardsFromDeck(String gameId, Integer drawNumber, String playerId){
        List<String> cards = getGameFromId(gameId).drawCards(drawNumber);
        if(cards.size() < drawNumber){
            wsOutput.sendPushToGroup(new BaseMessageOutputDTO(gameId, "not enough cards in deck"));
        }
        return cards;
    }
    public List<String> drawCards(String gameId, Integer drawNumber, String playerId, ContentQueryEnum reason, Integer thenDiscard){
        List<String> cards = cardsFromDeck(gameId, drawNumber, playerId);
        this.getGameFromId(gameId).addEventDrawCardsToPlayer(playerId, cards, thenDiscard);
        return cards;
    }

    public List<String> scanKeepCards(String gameId, Integer drawNumber, String playerId, ContentQueryEnum reason, Integer keep, ScanKeepOptionsEnum options){
        List<String> cards = cardsFromDeck(gameId, drawNumber, playerId);
        Game game = this.getGameFromId(gameId);

        switch(reason){
            case RESEARCH_QUERY :
                game.setResearchResolved(playerId, cards, keep);
                game.addEventResearchCardsToPlayer(playerId, cards, keep);
                break;
            case SCAN_KEEP_QUERY :
                game.addEventScanKeepCardsToPlayer(playerId, cards, keep, options);
            default:
                logger.debug("UNHANDLED DRAW REASON - NO EVENT SAVED IN PLAYER EVENTSTATE: " + reason);
                break;
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
        game.resetResearchResolved();
        game.claimMilestones();
        logger.debug("GAME OVER:" + game.isGameOver());
        if(game.isGameOver()){
            game.setGameStatus(GameStatusEnum.GAME_OVER);
            wsOutput.sendPushToGroup(MessageOutputFactory.createNextPhaseMessage(game.getGameId(), game.getGameState()));
            return;
        }
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
                Boolean merger = game.getGameOptions().getModeMerger();
                if(merger){
                    game.setAllPlayersNotReady();
                    game.setGameStatus(GameStatusEnum.SELECT_CORPORATION_MERGER);
                    wsOutput.sendPushToGroup(MessageOutputFactory.createSelectCorporationMergerMessage(game.getGameId(), game.getGameState()));
                } else {
                    game.setGameStatus(GameStatusEnum.STARTED);
                    game.removeCorporationsFromHands();
                    this.goToNextPhase(game);
                }
                break;

            case SELECT_CORPORATION_MERGER:
                game.setGameStatus(GameStatusEnum.STARTED);
                game.removeCorporationsFromHands();
                this.goToNextPhase(game);
                break;

            case STARTED:
                this.goToNextPhase(game);
                break;

            case GAME_OVER:
                wsOutput.sendPushToGroup(MessageOutputFactory.createNextPhaseMessage(game.getGameId(), game.getGameState()));
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
        List<String> cardsToDraw = game.drawFlippedOceanCards(playerId, oceans);
        if(cardsToDraw.size()>0){
            playerState.addEventDrawCards(cardsToDraw,0); 
        }
        game.setPlayerState(playerId, playerState);
        JsonGameDataHandler.saveGame(game);
        wsOutput.sendPushToPlayer(MessageOutputFactory.createOceanFlippedMessage(gameId, oceans, cardsToDraw), playerId);
    }

    public Boolean isResearchResolved(String gameId, String playerId) {
        return getGameFromId(gameId).isResearchResolved(playerId);
    }
}
