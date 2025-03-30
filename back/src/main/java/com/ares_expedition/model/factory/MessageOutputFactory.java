package com.ares_expedition.model.factory;

import java.util.Map;

import com.ares_expedition.dto.websocket.messages.output.AckMessageOutput;
import com.ares_expedition.dto.websocket.messages.output.BaseMessageOutputDTO;
import com.ares_expedition.dto.websocket.messages.output.GameStateMessageOutputDTO;
import com.ares_expedition.enums.websocket.ContentResultEnum;
import com.ares_expedition.model.answer.DrawResult;

public class MessageOutputFactory {
    public static BaseMessageOutputDTO createDEBUGMessage(String gameId, Object content) {
        return new BaseMessageOutputDTO(gameId, ContentResultEnum.DEBUG, content);
    }

    public static BaseMessageOutputDTO createPlayerReadyMessage(String gameId, Map<String, Boolean> content) {
        return new BaseMessageOutputDTO(gameId, ContentResultEnum.READY_RESULT, content);
    }

    public static BaseMessageOutputDTO createNextPhaseMessage(String gameId, GameStateMessageOutputDTO content) {
        return new BaseMessageOutputDTO(gameId, ContentResultEnum.NEXT_PHASE, content);
    }

    public static BaseMessageOutputDTO createDrawResultMessage(String gameId, DrawResult content) {
        return new BaseMessageOutputDTO(gameId, ContentResultEnum.DRAW_RESULT, content);
    }

    public static BaseMessageOutputDTO createGameStateMessage(String gameId, GameStateMessageOutputDTO content) {
        return new BaseMessageOutputDTO(gameId, ContentResultEnum.GAME_STATE, content);
    }

    public static BaseMessageOutputDTO createConnectMessage(String gameId, GameStateMessageOutputDTO content) {
        return new BaseMessageOutputDTO(gameId, ContentResultEnum.PLAYER_CONNECT, content);
    }

    public static AckMessageOutput createAck(String gameId, String uuid){
        return new AckMessageOutput(gameId, uuid);
    }

    public static BaseMessageOutputDTO createStartGameMessage(String gameId, Object content) {
        return new BaseMessageOutputDTO(gameId, ContentResultEnum.START_GAME, content);
    }
}
