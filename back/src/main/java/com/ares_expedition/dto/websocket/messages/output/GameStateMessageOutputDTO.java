package com.ares_expedition.dto.websocket.messages.output;

import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.Map;

import com.ares_expedition.dto.websocket.content.player_state.PlayerStateDTO;
import com.ares_expedition.enums.game.GameStatusEnum;
import com.ares_expedition.enums.game.PhaseEnum;
import com.ares_expedition.model.core.GameOptions;
import com.ares_expedition.model.player_state.PlayerState;

public class GameStateMessageOutputDTO {
    private PhaseEnum currentPhase;
    private Map<String, Boolean> groupReady;
    private LinkedHashSet<PhaseEnum> selectedPhase;
    private Map<String, PlayerStateDTO> groupPlayerState;
    private GameStatusEnum gameStatus;
    private GameOptions gameOptions;

    public GameStateMessageOutputDTO(){
    }
    public PhaseEnum getCurrentPhase(){
        return this.currentPhase;
    }
    public void setCurrentPhase(PhaseEnum currentPhase){
        this.currentPhase = currentPhase;
    }
    public Map<String, Boolean> getGroupReady(){
        return this.groupReady;
    }
    public void setGroupReady(Map<String, Boolean> ready){
        this.groupReady = ready;
    }
    public LinkedHashSet<PhaseEnum> getSelectedPhase(){
        return this.selectedPhase;
    }
    public void setSelectedPhase(LinkedHashSet<PhaseEnum> phases){
        this.selectedPhase = phases;
    }
    public Map<String, PlayerStateDTO> getGroupPlayerStatePublic(){
        return this.groupPlayerState;
    }
    public void setGroupPlayerStatePublic(Map<String, PlayerState> groupState){
        Map<String, PlayerStateDTO> groupDTO = new HashMap<>();
        for(var state : groupState.entrySet()){
            groupDTO.put(state.getKey(), state.getValue().toJson());
        }
        
        this.groupPlayerState = groupDTO;
    }
    public PlayerStateDTO getPlayerStatePublic(String playerId){
        return this.groupPlayerState.get(playerId);
    }
    public void setPlayerState(String playerId, PlayerStateDTO state){
        this.groupPlayerState.put(playerId, state);
    }
    public GameStatusEnum getGameStatus() {
        return gameStatus;
    }
    public void setGameStatus(GameStatusEnum gameStatus) {
        this.gameStatus = gameStatus;
    }
    public GameOptions getGameOptions() {
        return gameOptions;
    }
    public void setGameOptions(GameOptions gameOptions) {
        this.gameOptions = gameOptions;
    }
    
}
