package com.ares_expedition.services;

import org.springframework.stereotype.Service;
import com.ares_expedition.dto.api.NewGameConfigDTO;

@Service
public class NewGameService {
    public String createGame(NewGameConfigDTO gameConfig) {
        // Simule la création de la partie (plus tard, on pourra sauvegarder en base)
        return "Game created with mode: " + gameConfig.getGameMode() + 
               ", max players: " + gameConfig.getMaxPlayers();
    }
}
