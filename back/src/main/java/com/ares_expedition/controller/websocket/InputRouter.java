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
import com.ares_expedition.dto.websocket.content.input.PlayerStateContentDTO;
import com.ares_expedition.dto.websocket.content.input.UnHandledContentDTO;
import com.ares_expedition.dto.websocket.messages.input.*;
import com.ares_expedition.dto.websocket.messages.output.BaseMessageOutputDTO;
import com.ares_expedition.enums.game.PhaseEnum;
import com.ares_expedition.enums.websocket.ContentResultEnum;
import com.ares_expedition.model.answer.DrawResult;
import com.ares_expedition.model.factory.MessageOutputFactory;
import com.ares_expedition.model.game.PlayerState;
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
                    message, PlayerStateContentDTO.class,
                    PlayerStateMessageDTO.class, this::handlePlayerStatePushMessage);
                break;
            default:
                handleQuery(
                    message, UnHandledContentDTO.class,
                    UnHandledMessageDTO.class, this::handleNotRoutedMessage);
                break;
        }
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
        if(queryContent.toString().equals("SET_BOTS_READY")){
            gameController.setPlayerReady(1, 1, true);
            gameController.setPlayerReady(1, 2, true);
            gameController.setPlayerReady(1, 3, true);
            Integer gameId = query.getGameId();
            wsOutput.sendPushToGroup(MessageOutputFactory.createPlayerReadyMessage(gameId, gameController.getGroupPlayerReady(gameId)));
            
            if(!gameController.getAllPlayersReady(gameId)){
                wsOutput.sendPushToGroup(MessageOutputFactory.createPlayerReadyMessage(gameId, gameController.getGroupPlayerReady(gameId)));
                return;
            }
    
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
        Integer gameId = query.getGameId();
        gameController.setPlayerReady(gameId, query.getPlayerId(), query.getContent().getReady());

        if(!gameController.getAllPlayersReady(gameId)){
            wsOutput.sendPushToGroup(MessageOutputFactory.createPlayerReadyMessage(gameId, gameController.getGroupPlayerReady(gameId)));
            return;
        }

        gameController.setAllPlayersNotReady(gameId);
        gameController.nextPhaseSelected(gameId);
        wsOutput.sendPushToGroup(MessageOutputFactory.createNextPhaseMessage(gameId, gameController.getGameState(gameId)));
    }

    private void handleGameStateQuery(GenericMessageDTO query){
        Integer gameId = query.getGameId();
        wsOutput.sendPushToPlayer(MessageOutputFactory.createGameStateMessage(gameId, gameController.getGameState(gameId)), query.getPlayerId());
    }
    
    private void handlePhaseSelectedQuery(PhaseSelectedMessageDTO query){
        Integer gameId = query.getGameId();
        PhaseEnum phase = query.getContent().getPhase();
        gameController.addPhaseSelected(gameId, phase);
        wsOutput.sendPushToGroup(MessageOutputFactory.createDEBUGMessage(gameId, gameController.getPhaseSelected(gameId)));
    }

    private void handlePlayerStatePushMessage(PlayerStateMessageDTO query){
        gameController.setPlayerState(
            query.getGameId(),
            query.getPlayerId(),
            PlayerState.toModel(query.getContent())
            );
    }
}
