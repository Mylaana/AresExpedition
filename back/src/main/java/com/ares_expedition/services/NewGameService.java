package com.ares_expedition.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.ares_expedition.controller.websocket.InputRouter;
import com.ares_expedition.dto.api.NewGameConfigDTO;
import com.ares_expedition.dto.api.NewGameInfoDTO;
import com.ares_expedition.model.core.Game;
import com.ares_expedition.repository.JsonGameDataHandler;

@Service
public class NewGameService {
    private static final Logger logger = LoggerFactory.getLogger(InputRouter.class);
    public NewGameInfoDTO createGame(NewGameConfigDTO gameConfig) {
        Game game = Game.createGame(gameConfig);
        this.addNewGameToDataBase(game);
        logger.warn("\u001B[32m Creating new game with id: " + gameConfig.getGameId() + " for : " + gameConfig.getPlayers().size()+ " player(s) \u001B[0m");
        return new NewGameInfoDTO(gameConfig.getGameId(), gameConfig.getPlayers(), gameConfig.getOptions());
    }
    private void addNewGameToDataBase(Game newGame) {
        JsonGameDataHandler.saveGame(newGame);
    }
}
