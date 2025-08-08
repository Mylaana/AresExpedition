package com.ares_expedition.controller.api;

import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ares_expedition.controller.game.GameController;
import com.ares_expedition.dto.api.CreatePlayerDTO;
import com.ares_expedition.dto.api.NewGameConfigDTO;
import com.ares_expedition.dto.api.NewGameInfoDTO;
import com.ares_expedition.services.NewGameService;

@RestController
@RequestMapping("/api")
public class ApiController {
    private static final Logger logger = LoggerFactory.getLogger(ApiController.class);
    private final GameController gameController;
    private final NewGameService newGameService;

    @Autowired
    public ApiController(NewGameService newGameService, GameController gameController){
        this.newGameService = newGameService;
        this.gameController = gameController;
    }

    @PostMapping("/create-game")
    public ResponseEntity<Map<String, Object>> createGame(@RequestBody NewGameConfigDTO gameConfig) {
        NewGameInfoDTO newGameInfo = newGameService.createGame(gameConfig);
        Map<String, Object> response = new HashMap<>();
        if(newGameInfo==null){
            return (ResponseEntity<Map<String, Object>>) ResponseEntity.badRequest();
        }
        List<String> optionList = new ArrayList<>();
        for(Map.Entry<String, Object> entry: gameConfig.getOptions().entrySet()){
            String enabled = entry.getValue().toString();
            if(enabled=="true"){
                optionList.add(entry.getKey().toString());
            }
        }
        List<String> playerNames = new ArrayList<>();
        List<String> playerId = new ArrayList<>();
        for(CreatePlayerDTO p: newGameInfo.getPlayers()){
            playerNames.add(p.getName());
            playerId.add(p.getId());
        }
        logger.warn("\u001B[32m ------------New game------------ \u001B[0m");
        logger.warn("Id: " + gameConfig.getGameId());
        logger.warn("Player number: " + gameConfig.getPlayers().size());
        logger.warn("Names: " + playerNames);
        logger.warn("Id: " + playerId);
        logger.warn("Options: " + optionList);
        logger.warn("\u001B[32m -------------------------------- \u001B[0m");

        gameController.loadGame(gameConfig.getGameId());
        response.put("message", newGameInfo);
        return ResponseEntity.ok(response);
    }
}
