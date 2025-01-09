package com.ares_expedition.repository;

import java.util.*;
import java.util.stream.Collectors;

import com.ares_expedition.dto.deserializer.IntegerKeyDeserializer;
import com.ares_expedition.dto.websocket.messages.output.GameStateMessageOutputDTO;
import com.ares_expedition.enums.game.PhaseEnum;
import com.ares_expedition.model.game.PlayerState;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

public class Game {
    private Integer gameId;
    private List<Integer> deck = new ArrayList<>();
    private List<Integer> discard = new ArrayList<>();
    private List<Integer> groupPlayerId = new ArrayList<>();
    private Map<Integer, Boolean> groupPlayerReady = new HashMap<>();
    private PhaseEnum currentPhase;
    private LinkedHashSet<PhaseEnum> selectedPhase = new LinkedHashSet<>();
    @JsonDeserialize(keyUsing = IntegerKeyDeserializer.class)
    private Map<Integer, PlayerState> groupPlayerState = new HashMap<>();

    public Game() {
    }
    public Game(Integer gameId, List<Integer> deck, List<Integer> discard, List<Integer> groupPlayerId, PhaseEnum currentPhase) {
        this.gameId = gameId;
        this.deck = deck;
        this.discard = discard;
        this.groupPlayerId = groupPlayerId;
        this.currentPhase = currentPhase;        
    }
    public Integer getGameId() {
        return this.gameId;
    }
    public void setGameId(Integer gameId) {
        this.gameId = gameId;
    }
    public List<Integer> getDeck() {
        return this.deck;
    }
    public void setDeck(List<Integer> deck) {
        this.deck = deck;
    }
    public List<Integer> getDiscard() {
        return this.discard;
    }
    public void setDiscard(List<Integer> discard) {
        this.discard = discard;
    }
    public List<Integer> getGroupPlayerId(){
        return this.groupPlayerId;
    }
    public void setGroupPlayerId(List<Integer> groupPlayerId){
        this.groupPlayerId = groupPlayerId;
    }
    public Map<Integer, Boolean> getGroupPlayerReady(){
        return this.groupPlayerReady;
    }
    public void setGroupPlayerReady(Map<Integer, Boolean> groupReady){
        this.groupPlayerReady = groupReady;
    }
    public LinkedHashSet<PhaseEnum> getSelectedPhase(){
        return this.selectedPhase;
    }
    public void setSelectedPhase(LinkedHashSet<PhaseEnum> selectedPhase){
        this.selectedPhase = selectedPhase;
    }
    public List<Integer> drawCards(Integer drawNumber){
        ArrayList<Integer> result = new ArrayList<Integer>();

        checkDeckSize(drawNumber);        
        Integer cardsToDraw = Math.min(drawNumber,this.deck.size());

        for(Integer i=0; i<cardsToDraw; i++){
            result.add(this.deck.get(0));
            this.deck.remove(0);
        }

        return result;
    }
    private void checkDeckSize(Integer drawNumber){
        if(drawNumber<=this.deck.size()){return;}
        addDiscardToDeck();
        
    }
    private void addDiscardToDeck(){
        Collections.shuffle(this.discard);
        this.deck.addAll(this.discard);
        this.discard.clear();
    }
    public void shuffleDeck(){
        if (this.deck == null) {  // Exemple de validation
            throw new IllegalStateException("Deck must be initialized before shuffling.");
        }
        Collections.shuffle(this.deck);
    }
    public void setPlayerReady(Integer playerId, Boolean ready){
        this.groupPlayerReady.replace(playerId, ready);
    }
    public void setAllPlayersNotReady(){
        for(Integer playerId: this.groupPlayerId){
            this.setPlayerReady(playerId, false);
        }
    }
    public GameStateMessageOutputDTO getGameState(){
        GameStateMessageOutputDTO gameState = new GameStateMessageOutputDTO();
        gameState.setCurrentPhase(currentPhase);
        gameState.setGroupReady(groupPlayerReady);
        gameState.setSelectedPhase(selectedPhase);
        gameState.setGroupPlayerStatePublic(this.groupPlayerState);

        return gameState;
    }
    public PhaseEnum getCurrentPhase(){
        return this.currentPhase;
    }
    public void setCurrentPhase(PhaseEnum phase){
        this.currentPhase = phase;
    }
    public void nextPhaseSelected(){
        LinkedHashSet<PhaseEnum> tempSelectedPhase = new LinkedHashSet<>(this.selectedPhase);

        for(PhaseEnum phase: this.selectedPhase){
            if(phase.equals(this.currentPhase)){
                tempSelectedPhase.removeFirst();
                break;
            }
            tempSelectedPhase.removeFirst();
        }

        if(tempSelectedPhase.size()!=0){
            this.currentPhase = tempSelectedPhase.getFirst();
            return;
        }
        this.selectedPhase.clear();
        this.selectedPhase.add(PhaseEnum.PLANIFICATION);
        this.currentPhase = this.selectedPhase.getFirst();
    }
    public void addPhaseSelected(PhaseEnum phase){
        this.selectedPhase.add(phase);
        sortPhaseSelected();
    }
    private void sortPhaseSelected(){
        Comparator<PhaseEnum> customComparator = Comparator.comparingInt(PhaseEnum::getPriority);

        List<PhaseEnum> sortedList = selectedPhase.stream()
                .sorted(customComparator)
                .collect(Collectors.toList());
        
        // Vide le LinkedHashSet et réinsère les éléments dans l'ordre trié
        selectedPhase.clear();
        selectedPhase.addAll(sortedList);
    }
    public LinkedHashSet<PhaseEnum>getPhaseSelected(){
        return this.selectedPhase;
    }
    public void setPlayerState(Integer playerId, PlayerState state){
        this.groupPlayerState.put(playerId, state);
    }


    @Override
    public String toString() {
        return "Game{gameId=" + gameId + ", deck=" + deck + "}";
    }
}