package com.ares_expedition.dto.websocket.serialized_message.answer.content;

import java.util.Map;

import com.ares_expedition.enums.game.PhaseEnum;

public class GameStateContent {
    private PhaseEnum currentPhase;
    private Map<Integer, Boolean> groupReady;

    public GameStateContent(){
    }
    public PhaseEnum getCurrentPhase(){
        return this.currentPhase;
    }
    public void setCurrentPhase(PhaseEnum currentPhase){
        this.currentPhase = currentPhase;
    }
    public Map<Integer, Boolean> getGroupReady(){
        return this.groupReady;
    }
    public void setGroupReady(Map<Integer, Boolean> ready){
        this.groupReady = ready;
    }
}
