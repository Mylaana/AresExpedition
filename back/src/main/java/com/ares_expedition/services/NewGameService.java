package com.ares_expedition.services;

import org.springframework.stereotype.Service;

import com.ares_expedition.dto.api.NewGameConfigDTO;
import com.ares_expedition.dto.api.NewGameInfoDTO;

@Service
public class NewGameService {
    public NewGameInfoDTO createGame(NewGameConfigDTO gameConfig) {
        //should call game creation service
        return new NewGameInfoDTO(gameConfig.getGameId(), gameConfig.getPlayers(), gameConfig.getOptions());
    }
}
