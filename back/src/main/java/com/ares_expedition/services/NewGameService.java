package com.ares_expedition.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.ares_expedition.dto.api.NewGameConfigDTO;
import com.ares_expedition.dto.api.NewGameInfoDTO;
import com.ares_expedition.model.core.Game;
import com.ares_expedition.repository.JsonGameDataHandler;

@Service
public class NewGameService {
    public NewGameInfoDTO createGame(NewGameConfigDTO gameConfig) {
        Game game = Game.createGame(gameConfig);
        this.addNewGameToDataBase(game);
        return new NewGameInfoDTO(gameConfig.getGameId(), gameConfig.getPlayers(), gameConfig.getOptions());
    }
    private void addNewGameToDataBase(Game newGame) {
        JsonGameDataHandler.saveGame(newGame);
    }
}
