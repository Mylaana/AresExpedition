package com.ares_expedition.controller.websocket;

import java.util.function.Consumer;

import org.springframework.stereotype.Service;

import com.ares_expedition.controller.game.GameController;
import com.ares_expedition.dto.websocket.serialized_message.answer.PlayerMessageAnswer;
import com.ares_expedition.dto.websocket.serialized_message.query.DrawMessageQuery;
import com.ares_expedition.dto.websocket.serialized_message.query.PlayerMessageQuery;
import com.ares_expedition.dto.websocket.serialized_message.query.PlayerReadyMessageQuery;
import com.ares_expedition.enums.websocket.ContentResultEnum;
import com.ares_expedition.model.query.GenericQuery;
import com.ares_expedition.model.query.draw.DrawQuery;
import com.ares_expedition.model.query.player.PlayerReadyQuery;
import com.ares_expedition.services.QueryMessageFactory;

@Service
public class InputRouter {
    private final WsControllerOutput wsOutput;
    private final GameController gameController;

    public InputRouter(WsControllerOutput wsOutput, GameController gameController) {
        this.wsOutput = wsOutput;
        this.gameController = gameController;
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
            default:
                break;
        }
    }

    private <C extends GenericQuery, M extends PlayerMessageQuery<C>> void handleQuery(
            PlayerMessageQuery<?> message,
            Class<C> contentType,
            Class<M> messageQueryType,
            Consumer<M> handler) {
        
        M query = QueryMessageFactory.createMessageQuery(message, contentType, messageQueryType);
        handler.accept(query);
    }

    private void handleDrawQuery(DrawMessageQuery query) {
        Integer drawNumber = query.getDrawNumber();
        if (drawNumber == 0) {
            return;
        }
        wsOutput.sendPushToPlayer(query.getGameId(), query.getPlayerId(), this.gameController.drawCards(query.getGameId(), drawNumber));
    }

    private void handlePlayerReadyQuery(PlayerReadyMessageQuery query) {
        Integer gameId = query.getGameId();
        gameController.setPlayerReady(gameId, query.getPlayerId(), query.getContent().getPlayerReady());
        wsOutput.sendPushToGroup(new PlayerMessageAnswer(gameId, ContentResultEnum.PLAYER_READY_RESULT, gameController.getGroupPlayerReady(gameId)));
    }
}
