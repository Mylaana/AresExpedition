package com.ares_expedition.controller.api;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ares_expedition.controller.game.GameController;
import com.ares_expedition.dto.api.CreatePlayerDTO;
import com.ares_expedition.dto.api.NewGameConfigDTO;
import com.ares_expedition.dto.api.NewGameInfoDTO;
import com.ares_expedition.enums.game.GameContentNameEnum;
import com.ares_expedition.model.core.subModel.GameOption;
import com.ares_expedition.services.NewGameService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api")
public class ApiController {
    private static final Logger logger = LoggerFactory.getLogger(ApiController.class);
    private final GameController gameController;
    private final NewGameService newGameService;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private static final Path STATS_FILE = Paths.get("data/analyzed_games.json");

    public ApiController(NewGameService newGameService, GameController gameController){
        this.newGameService = newGameService;
        this.gameController = gameController;
    }

    @PostMapping("/create-game")
    public ResponseEntity<?> createGame(@RequestBody NewGameConfigDTO gameConfig) {
        NewGameInfoDTO newGameInfo = newGameService.createGame(gameConfig);
        if (newGameInfo == null) {
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", "Game could not be created"));
        }
        List<String> optionList = new ArrayList<>();
        for(Map.Entry<GameContentNameEnum, GameOption> entry: gameConfig.getOptions().entrySet()){
            String enabled = entry.getValue().toString();
            optionList.add(entry.getKey().toString());
            if(enabled=="true"){
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
        return ResponseEntity.ok(newGameInfo);
    }
    @GetMapping("session/{gameId}/{playerId}")
    public ResponseEntity<?> validateSession(@PathVariable("gameId") String gameId, @PathVariable("playerId") String playerId){
        if(this.gameController.validateSession(gameId, playerId)){
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
    @GetMapping("stats")
    public ResponseEntity<?> getGameStats(){
        try {
            JsonNode stats = objectMapper.readTree(STATS_FILE.toFile());
            return ResponseEntity.ok(stats);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to read stats", "details", e.getMessage()));
        }
    }
}
