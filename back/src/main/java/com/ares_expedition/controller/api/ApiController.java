package com.ares_expedition.controller.api;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ares_expedition.controller.game.GameController;
import com.ares_expedition.dto.api.NewGameConfigDTO;
import com.ares_expedition.dto.api.NewGameInfoDTO;
import com.ares_expedition.services.NewGameService;

@RestController
@RequestMapping("/api")
public class ApiController {
    private final GameController gameController;
    private final NewGameService newGameService;

    @Autowired
    public ApiController(NewGameService newGameService, GameController gameController){
        this.newGameService = newGameService;
        this.gameController = gameController;
    }

    @PostMapping("/create-game")
    public ResponseEntity<Map<String, Object>> createGame(@RequestBody NewGameConfigDTO gameConfig) {
        //System.out.println("new game request" + gameConfig.toString());
        NewGameInfoDTO newGameInfo = newGameService.createGame(gameConfig);
        gameController.loadGame(gameConfig.getGameId());
        Map<String, Object> response = new HashMap<>();
        response.put("message", newGameInfo);
        return ResponseEntity.ok(response);
    }
}
