package com.ares_expedition.services;

import org.springframework.stereotype.Service;

import com.ares_expedition.dto.api.NewGameConfigDTO;
import com.ares_expedition.dto.api.NewGameInfoDTO;
import com.ares_expedition.repository.Game;

@Service
public class NewGameService {
    public NewGameInfoDTO createGame(NewGameConfigDTO gameConfig) {
        //should call game creation service
        Game game = Game.createGame(gameConfig);
        this.addNewGameToDataBase(game);

        return new NewGameInfoDTO(gameConfig.getGameId(), gameConfig.getPlayers(), gameConfig.getOptions());
    }
    private void addNewGameToDataBase(Game newGame) {

    }
}
