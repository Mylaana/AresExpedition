package com.ares_expedition.dto.websocket.serialized_message.answer.content;

import java.util.LinkedHashSet;
import java.util.Map;

import com.ares_expedition.enums.game.PhaseEnum;

public class GameStateContent {
    private PhaseEnum currentPhase;
    private Map<Integer, Boolean> groupReady;
    private LinkedHashSet<PhaseEnum> selectedPhase;

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
    public LinkedHashSet<PhaseEnum> getSelectedPhase(){
        return this.selectedPhase;
    }
    public void setSelectedPhase(LinkedHashSet<PhaseEnum> phases){
        this.selectedPhase = phases;
    }
}
