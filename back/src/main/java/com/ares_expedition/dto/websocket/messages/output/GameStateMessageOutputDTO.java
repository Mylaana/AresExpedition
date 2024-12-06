package com.ares_expedition.dto.websocket.messages.output;

import java.util.LinkedHashSet;
import java.util.Map;

import com.ares_expedition.enums.game.PhaseEnum;
import com.ares_expedition.model.game.PlayerState;

public class GameStateMessageOutputDTO {
    private PhaseEnum currentPhase;
    private Map<Integer, Boolean> groupReady;
    private LinkedHashSet<PhaseEnum> selectedPhase;
    private Map<Integer, PlayerState> groupPlayerState;

    public GameStateMessageOutputDTO(){
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
    public Map<Integer, PlayerState> getGroupPlayerStatePublic(){
        return this.groupPlayerState;
    }
    public void setGroupPlayerStatePublic(Map<Integer, PlayerState> groupState){
        this.groupPlayerState = groupState;
    }
    public PlayerState getPlayerStatePublic(Integer playerId){
        return this.groupPlayerState.get(playerId);
    }
    public void setPlayerState(Integer playerId, PlayerState state){
        this.groupPlayerState.put(playerId, state);
    }
}
