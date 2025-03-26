package com.ares_expedition.services;
import java.util.List;

import org.springframework.stereotype.Service;
import com.ares_expedition.dto.api.NewGameConfigDTO;
import com.ares_expedition.dto.api.NewGameInfoDTO;

@Service
public class NewGameService {
    public NewGameInfoDTO createGame(NewGameConfigDTO gameConfig) {
        //should call game creation service
        List<String> links = List.of("abc", "def");
        return new NewGameInfoDTO(links);
    }
}
