package com.ares_expedition.controller.websocket;

import java.util.HashMap;
import java.util.Map;
import java.util.function.Consumer;

import org.springframework.stereotype.Service;

import com.ares_expedition.controller.game.GameController;
import com.ares_expedition.dto.websocket.content.input.BaseContentDTO;
import com.ares_expedition.dto.websocket.content.input.DrawContentDTO;
import com.ares_expedition.dto.websocket.content.input.GenericContentDTO;
import com.ares_expedition.dto.websocket.content.input.PhaseSelectedContentDTO;
import com.ares_expedition.dto.websocket.content.input.PlayerReadyContentDTO;
import com.ares_expedition.dto.websocket.content.input.UnHandledContentDTO;
import com.ares_expedition.dto.websocket.content.player_state.PlayerStateDTO;
import com.ares_expedition.dto.websocket.messages.input.*;
import com.ares_expedition.dto.websocket.messages.output.BaseMessageOutputDTO;
import com.ares_expedition.enums.game.PhaseEnum;
import com.ares_expedition.enums.websocket.ContentResultEnum;
import com.ares_expedition.model.answer.DrawResult;
import com.ares_expedition.model.factory.MessageOutputFactory;
import com.ares_expedition.model.player_state.PlayerState;
import com.ares_expedition.repository.Game;
import com.ares_expedition.services.QueryMessageFactory;

@Service
public class InputRouter {
    private final WsControllerOutput wsOutput;
    private final GameController gameController;

    public InputRouter(WsControllerOutput wsOutput, GameController gameController) {
        this.wsOutput = wsOutput;
        this.gameController = gameController;
    }
    public <T> void routeDebug(BaseMessageInputDTO<T> message) {
        handleQuery(
                    message, GenericContentDTO.class,
                    GenericMessageDTO.class, this::handleDEBUGMessage);
    }
    public <T> void routeInput(BaseMessageInputDTO<T> message) {
        switch (message.getContentEnum()) {
            case DRAW_QUERY:
                handleQuery(
                    message, DrawContentDTO.class,
                    DrawMessageDTO.class, this::handleDrawQuery);
                break;
            case READY_QUERY:
                handleQuery(
                    message, PlayerReadyContentDTO.class,
                    PlayerReadyMessageDTO.class, this::handlePlayerReadyQuery);
                break;
            case PLAYER_GAME_STATE_QUERY:
                handleQuery(
                    message, GenericContentDTO.class,
                    GenericMessageDTO.class, this::handleGameStateQuery);
                break;
            case SELECTED_PHASE_QUERY:
                handleQuery(    
                    message, PhaseSelectedContentDTO.class,
                    PhaseSelectedMessageDTO.class, this::handlePhaseSelectedQuery);
                break;
            case PLAYER_STATE_PUSH:
                    handleQuery(    
                    message, PlayerStateDTO.class,
                    PlayerStateMessageDTO.class, this::handlePlayerStatePushMessage);
                break;
            case PLAYER_CONNECT:
                handleQuery(    
                    message, GenericContentDTO.class,
                    GenericMessageDTO.class, this::handlePlayerConnection);
                break;
            default:
                handleQuery(
                    message, UnHandledContentDTO.class,
                    UnHandledMessageDTO.class, this::handleNotRoutedMessage);
                break;
        }
        wsOutput.sendAckToPlayer(MessageOutputFactory.createAck(message.getGameId(), message.getUuid()), message.getPlayerId());
    }
    private <C extends BaseContentDTO, M extends BaseMessageInputDTO<C>> void handleQuery(
            BaseMessageInputDTO<?> message,
            Class<C> contentType,
            Class<M> messageQueryType,
            Consumer<M> handler) {
        
        M query = QueryMessageFactory.createMessageQuery(message, contentType, messageQueryType);
        handler.accept(query);
    }
    
    private void handleDEBUGMessage(GenericMessageDTO query){
        Object queryContent = query.getContent().getContent().toString();
        System.out.println("\u001B[33m HANDLEING DEBUG MESSAGE for gameId: " + query.getGameId() + " with queryContent: " + queryContent.toString() + "\u001B[0m");
        if(queryContent.toString().equals("SET_BOTS_READY")){
            gameController.setPlayerReady("1", "1", true);
            gameController.setPlayerReady("1", "2", true);
            gameController.setPlayerReady("1", "3", true);
            String gameId = query.getGameId();
            
            if(!gameController.getAllPlayersReady(gameId)){return;}
    
            System.out.println("\u001B[32m DEBUG GOING THROUGH" +  "\u001B[0m");
            gameController.setAllPlayersNotReady(gameId);
            gameController.nextPhaseSelected(gameId);
            wsOutput.sendPushToGroup(MessageOutputFactory.createNextPhaseMessage(gameId, gameController.getGameState(gameId)));
            return;
        }
    }
    
    private void handleNotRoutedMessage(UnHandledMessageDTO query){
        Map<String, Object> result = new HashMap<>();
        result.put("contentEnum", query.getContentEnum());
        result.put("content", query.getContent());

        wsOutput.sendPushToGroup(new BaseMessageOutputDTO(query.getGameId(), ContentResultEnum.SERVER_SIDE_UNHANDLED, result));
    }

    private void handleDrawQuery(DrawMessageDTO query){
        Integer drawNumber = query.getDrawNumber();
        if (drawNumber == 0) {
            return;
        }
        wsOutput.sendPushToPlayer(
            MessageOutputFactory.createDrawResultMessage(query.getGameId(), new DrawResult(this.gameController.drawCards(query.getGameId(), drawNumber), query.getEventId())),
            query.getPlayerId()
            );
    }

    private void handlePlayerReadyQuery(PlayerReadyMessageDTO query) {
        System.out.println("\u001B[32m HANDLEING PlayerReadyQuery for gameId: " + query.getGameId() + "\u001B[0m");
        String gameId = query.getGameId();
        gameController.setPlayerReady(gameId, query.getPlayerId(), query.getContent().getReady());
    }

    private void handleGameStateQuery(GenericMessageDTO query){
        System.out.println("\u001B[32m HANDLEING Game state query for gameId: " + query.getGameId() + "\u001B[0m");
        String gameId = query.getGameId();
        wsOutput.sendPushToPlayer(MessageOutputFactory.createGameStateMessage(gameId, gameController.getGameState(gameId)), query.getPlayerId());
    }
    
    private void handlePhaseSelectedQuery(PhaseSelectedMessageDTO query){
        System.out.println("\u001B[32m HANDLEING phase selected for gameId: " + query.getGameId() + "\u001B[0m");
        String gameId = query.getGameId();
        PhaseEnum phase = query.getContent().getPhase();
        gameController.addPhaseSelected(gameId, phase);
        wsOutput.sendPushToGroup(MessageOutputFactory.createDEBUGMessage(gameId, gameController.getPhaseSelected(gameId)));
    }

    private void handlePlayerStatePushMessage(PlayerStateMessageDTO query){
        System.out.println("\u001B[32m HANDLEING player state push for gameId: " + query.getGameId() + "\u001B[0m");
        gameController.setPlayerState(
            query.getGameId(),
            query.getPlayerId(),
            PlayerState.fromJson(query.getContent())
            );
    }
    
    private void handlePlayerConnection(GenericMessageDTO query) {
        System.out.println("\u001B[32m HANDLEING player connection query for gameId: " + query.getGameId() + "\u001B[0m");
        String gameId = query.getGameId();
        Game game = gameController.getGameFromId(gameId);
        Boolean gameStarted = gameController.getGameStarted(gameId);
        if (gameStarted) {
            wsOutput.sendPushToPlayer(MessageOutputFactory.createConnectMessage(gameId, gameController.getGameState(gameId)), query.getPlayerId());    
        } else {
            wsOutput.sendPushToPlayer(MessageOutputFactory.createStartGameMessage(gameId, ""), query.getPlayerId());
        }
        
    }
}
