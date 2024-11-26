package com.ares_expedition.controller.websocket;

import java.util.HashMap;
import java.util.Map;
import java.util.function.Consumer;

import org.springframework.stereotype.Service;

import com.ares_expedition.controller.game.GameController;
import com.ares_expedition.dto.websocket.serialized_message.answer.PlayerMessageAnswer;
import com.ares_expedition.dto.websocket.serialized_message.query.DrawMessageQuery;
import com.ares_expedition.dto.websocket.serialized_message.query.GenericMessageQuery;
import com.ares_expedition.dto.websocket.serialized_message.query.PhaseSelectedMessageQuery;
import com.ares_expedition.dto.websocket.serialized_message.query.PlayerMessageQuery;
import com.ares_expedition.dto.websocket.serialized_message.query.PlayerReadyMessageQuery;
import com.ares_expedition.dto.websocket.serialized_message.query.UnHandledMessageQuery;
import com.ares_expedition.enums.game.PhaseEnum;
import com.ares_expedition.enums.websocket.ContentResultEnum;
import com.ares_expedition.model.answer.DrawResult;
import com.ares_expedition.model.factory.MessageOutputFactory;
import com.ares_expedition.model.query.BaseQuery;
import com.ares_expedition.model.query.draw.DrawQuery;
import com.ares_expedition.model.query.player.GenericQuery;
import com.ares_expedition.model.query.player.PhaseSelectedQuery;
import com.ares_expedition.model.query.player.PlayerReadyQuery;
import com.ares_expedition.model.query.player.UnHandledQuery;
import com.ares_expedition.services.QueryMessageFactory;

@Service
public class InputRouter {
    private final WsControllerOutput wsOutput;
    private final GameController gameController;

    public InputRouter(WsControllerOutput wsOutput, GameController gameController) {
        this.wsOutput = wsOutput;
        this.gameController = gameController;
    }
    public void routeDebug(Object message) {
        if(message=="SET_BOTS_READY"){
            gameController.setPlayerReady(1, 1, true);
            gameController.setPlayerReady(1, 2, true);
            gameController.setPlayerReady(1, 3, true);
            return;
        }
        wsOutput.sendPushToGroup(new PlayerMessageAnswer(1, "received message: " + message));
    }
    public <T> void routeInput(PlayerMessageQuery<T> message) {
        switch (message.getContentEnum()) {
            case DRAW_QUERY:
                handleQuery(
                    message, DrawQuery.class,
                    DrawMessageQuery.class, this::handleDrawQuery);
                break;
            case READY_QUERY:
                handleQuery(
                    message, PlayerReadyQuery.class,
                    PlayerReadyMessageQuery.class, this::handlePlayerReadyQuery);
                break;
            case PLAYER_GAME_STATE_QUERY:
                handleQuery(
                    message, GenericQuery.class,
                    GenericMessageQuery.class, this::handleGameStateQuery);
                    break;
            case SELECTED_PHASE_QUERY:
                handleQuery(    
                    message, PhaseSelectedQuery.class,
                    PhaseSelectedMessageQuery.class, this::handlePhaseSelectedQuery);
                break;
            default:
                handleQuery(
                    message, UnHandledQuery.class,
                    UnHandledMessageQuery.class, this::handleNotRoutedMessage);
                break;
        }
    }
    private <C extends BaseQuery, M extends PlayerMessageQuery<C>> void handleQuery(
            PlayerMessageQuery<?> message,
            Class<C> contentType,
            Class<M> messageQueryType,
            Consumer<M> handler) {
        
        M query = QueryMessageFactory.createMessageQuery(message, contentType, messageQueryType);
        handler.accept(query);
    }
    private void handleNotRoutedMessage(UnHandledMessageQuery query){
        Map<String, Object> result = new HashMap<>();
        result.put("contentEnum", query.getContentEnum());
        result.put("content", query.getContent());

        wsOutput.sendPushToGroup(new PlayerMessageAnswer(query.getGameId(), ContentResultEnum.SERVER_SIDE_UNHANDLED, result));
    }
    private void handleDrawQuery(DrawMessageQuery query){
        Integer drawNumber = query.getDrawNumber();
        if (drawNumber == 0) {
            return;
        }
        wsOutput.sendPushToPlayer(
            MessageOutputFactory.createDrawResultMessage(query.getGameId(), new DrawResult(this.gameController.drawCards(query.getGameId(), drawNumber), query.getEventId())),
            query.getPlayerId()
            );
    }
    private void handlePlayerReadyQuery(PlayerReadyMessageQuery query) {
        Integer gameId = query.getGameId();
        gameController.setPlayerReady(gameId, query.getPlayerId(), query.getContent().getPlayerReady());

        if(!gameController.getAllPlayersReady(gameId)){
            wsOutput.sendPushToGroup(MessageOutputFactory.createPlayerReadyMessage(gameId, gameController.getGroupPlayerReady(gameId)));
            return;
        }

        gameController.setAllPlayersNotReady(gameId);
        gameController.nextPhaseSelected(gameId);
        wsOutput.sendPushToGroup(MessageOutputFactory.createNextPhaseMessage(gameId, gameController.getGameState(gameId)));
    }
    private void handleGameStateQuery(GenericMessageQuery query){
        Integer gameId = query.getGameId();
        wsOutput.sendPushToPlayer(MessageOutputFactory.createGameStateMessage(gameId, gameController.getGameState(gameId)), query.getPlayerId());
    }
    private void handlePhaseSelectedQuery(PhaseSelectedMessageQuery query){
        Integer gameId = query.getGameId();
        PhaseEnum phase = query.getContent().getContent();
        gameController.addPhaseSelected(gameId, phase);
        wsOutput.sendPushToGroup(MessageOutputFactory.createDEBUGMessage(gameId, gameController.getPhaseSelected(gameId)));
    }
}
