package com.ares_expedition.repository.core;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;

import com.ares_expedition.enums.game.GameStatusEnum;
import com.ares_expedition.enums.game.PhaseEnum;
import com.ares_expedition.model.core.Game;
import com.ares_expedition.model.core.Ocean;
import com.ares_expedition.model.player_state.PlayerState;
import com.ares_expedition.model.player_state.subclass.substates.GlobalParameter;
import com.ares_expedition.repository.player_state.PlayerStateData;

//Game DTO is only meant to store their Game related properties, not to be sent to clients
public class GameData {
    private String gameId;
    private List<Integer> deck = new ArrayList<>();
    private List<Integer> discard = new ArrayList<>();
    private List<String> groupPlayerId = new ArrayList<>();
    private Map<String, Boolean> groupPlayerReady = new HashMap<>();
    private PhaseEnum currentPhase;
    private LinkedHashSet<PhaseEnum> selectedPhase = new LinkedHashSet<>();
    private Map<String, PlayerStateData> groupPlayerState = new HashMap<>();
    private GameStatusEnum gameStatus;
    private List<GlobalParameterData> globalParameters = new ArrayList<>();
    private List<Integer> deckCorporations = new ArrayList<>();
    private List<Ocean> oceans = new ArrayList<>();

    GameData() {
    }

    public GameData(Game game){
        this.gameId = game.getGameId();
        this.deck = game.getDeck();
        this.discard = game.getDiscard();
        this.groupPlayerId = game.getGroupPlayerId();
        this.groupPlayerReady = game.getGroupPlayerReady();
        this.currentPhase = game.getCurrentPhase();
        this.selectedPhase = game.getSelectedPhase();
        this.groupPlayerState = PlayerState.ToDataMap(game.getGroupPlayerState());
        this.gameStatus = game.getGameStatus();
        this.globalParameters = GlobalParameter.toDataList(game.getGlobalParameters());
        this.deckCorporations = game.getDeckCorporations();
        this.oceans = game.getOceans();
    }

    public String getGameId() {
        return gameId;
    }

    public void setGameId(String gameId) {
        this.gameId = gameId;
    }

    public List<Integer> getDeck() {
        return deck;
    }

    public void setDeck(List<Integer> deck) {
        this.deck = deck;
    }

    public List<Integer> getDiscard() {
        return discard;
    }

    public void setDiscard(List<Integer> discard) {
        this.discard = discard;
    }

    public List<String> getGroupPlayerId() {
        return groupPlayerId;
    }

    public void setGroupPlayerId(List<String> groupPlayerId) {
        this.groupPlayerId = groupPlayerId;
    }

    public Map<String, Boolean> getGroupPlayerReady() {
        return groupPlayerReady;
    }

    public void setGroupPlayerReady(Map<String, Boolean> groupPlayerReady) {
        this.groupPlayerReady = groupPlayerReady;
    }

    public PhaseEnum getCurrentPhase() {
        return currentPhase;
    }

    public void setCurrentPhase(PhaseEnum currentPhase) {
        this.currentPhase = currentPhase;
    }

    public LinkedHashSet<PhaseEnum> getSelectedPhase() {
        return selectedPhase;
    }

    public void setSelectedPhase(LinkedHashSet<PhaseEnum> selectedPhase) {
        this.selectedPhase = selectedPhase;
    }

    public Map<String, PlayerStateData> getGroupPlayerState() {
        return groupPlayerState;
    }

    public void setGroupPlayerState(Map<String, PlayerStateData> groupPlayerState) {
        this.groupPlayerState = groupPlayerState;
    }

    public GameStatusEnum getGameStatus() {
        return gameStatus;
    }

    public void setGameStatus(GameStatusEnum gameStatus) {
        this.gameStatus = gameStatus;
    }

    public List<GlobalParameterData> getGlobalParameters() {
        return globalParameters;
    }

    public void setGlobalParameters(List<GlobalParameterData> globalParameters) {
        this.globalParameters = globalParameters;
    }

    public List<Integer> getDeckCorporations() {
        return deckCorporations;
    }

    public void setDeckCorporations(List<Integer> deckCorporations) {
        this.deckCorporations = deckCorporations;
    }

    public List<Ocean> getOceans() {
        return oceans;
    }

    public void setOceans(List<Ocean> oceans) {
        this.oceans = oceans;
    }   
}