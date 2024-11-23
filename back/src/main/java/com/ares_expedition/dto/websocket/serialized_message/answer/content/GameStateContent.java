package com.ares_expedition.dto.websocket.serialized_message.answer.content;

import com.ares_expedition.enums.game.PhaseEnum;

public class GameStateContent {
    private Integer gameId;
    private PhaseEnum currentPhase;

    public GameStateContent(){
        this.gameId = 1;
        this.currentPhase = PhaseEnum.PLANIFICATION;
    }

    public Integer getGameId(){
        return this.gameId;
    }

    public void setGameId(Integer gameId){
        this.gameId = gameId;
    }

    public PhaseEnum getCurrentPhase(){
        return this.currentPhase;
    }

    public void setCurrentPhase(PhaseEnum currentPhase){
        this.currentPhase = currentPhase;
    }
}
