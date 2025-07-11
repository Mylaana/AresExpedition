package com.ares_expedition.model.factory;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.ares_expedition.dto.websocket.messages.output.AckMessageOutput;
import com.ares_expedition.dto.websocket.messages.output.BaseMessageOutputDTO;
import com.ares_expedition.dto.websocket.messages.output.GameStateMessageOutputDTO;
import com.ares_expedition.enums.game.RessourceEnum;
import com.ares_expedition.enums.websocket.ContentResultEnum;
import com.ares_expedition.model.answer.DrawResult;
import com.ares_expedition.model.answer.ResearchResult;
import com.ares_expedition.model.answer.ScanKeepResult;
import com.ares_expedition.model.core.Ocean;

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

    public static BaseMessageOutputDTO createScanKeepResultMessage(String gameId, ScanKeepResult content) {
        return new BaseMessageOutputDTO(gameId, ContentResultEnum.SCAN_KEEP_RESULT, content);
    }

    public static BaseMessageOutputDTO createResearchResultMessage(String gameId, ResearchResult content) {
        return new BaseMessageOutputDTO(gameId, ContentResultEnum.RESEARCH_RESULT, content);
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

    public static BaseMessageOutputDTO createOceanFlippedMessage(String gameId, List<Ocean> oceans, List<String> cardsToDraw){
        List<Map<RessourceEnum, Integer>> bonuses = new ArrayList<>();
        Map<String, Object> content = new HashMap<>();
        for(Ocean ocean: oceans){
            bonuses.add(ocean.getBonuses());
        }
        content.put("b", bonuses);
        if(cardsToDraw.size()>0){
            content.put("d", cardsToDraw);
        }
        return new BaseMessageOutputDTO(gameId, ContentResultEnum.OCEAN_RESULT, content);
    }
    /*
    public static BaseMessageOutputDTO createStartGameMessage(String gameId, Object content) {
        return new BaseMessageOutputDTO(gameId, ContentResultEnum.START_GAME, content);
    }
    */
    public static BaseMessageOutputDTO createSelectStartingHandMessage(String gameId,  GameStateMessageOutputDTO content) {
        return new BaseMessageOutputDTO(gameId, ContentResultEnum.SELECT_STARTING_HAND, content);
    }
    public static BaseMessageOutputDTO createSelectCorporationMessage(String gameId,  GameStateMessageOutputDTO content) {
        return new BaseMessageOutputDTO(gameId, ContentResultEnum.SELECT_CORPORATION, content);
    }
    public static BaseMessageOutputDTO createSelectCorporationMergerMessage(String gameId,  GameStateMessageOutputDTO content) {
        return new BaseMessageOutputDTO(gameId, ContentResultEnum.SELECT_CORPORATION_MERGER, content);
    }
}
