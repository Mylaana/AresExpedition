package com.ares_expedition.dto.websocket.serialized_message.answer.content;

import com.ares_expedition.enums.game.PhaseEnum;

public class GameStateContent {
    private PhaseEnum currentPhase;

    public GameStateContent(PhaseEnum phase){
        this.currentPhase = phase;
    }

    public PhaseEnum getCurrentPhase(){
        return this.currentPhase;
    }

    public void setCurrentPhase(PhaseEnum currentPhase){
        this.currentPhase = currentPhase;
    }
}
