package com.ares_expedition.controller.api;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ares_expedition.dto.api.NewGameConfigDTO;
import com.ares_expedition.services.NewGameService;

@RestController
@RequestMapping("/api")
public class ApiController {

    private final NewGameService newGameService;

    public ApiController(NewGameService newGameService){
        this.newGameService = newGameService;
    }

    @PostMapping("/create-game")
    public ResponseEntity<Map<String, String>> createGame(@RequestBody NewGameConfigDTO gameConfig) {
        String message = newGameService.createGame(gameConfig);
        Map<String, String> response = new HashMap<>();
        response.put("message", message);
        return ResponseEntity.ok(response);
    }
}
