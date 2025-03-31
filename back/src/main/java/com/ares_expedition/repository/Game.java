package com.ares_expedition.repository;

import java.util.*;
import java.util.stream.Collectors;

import com.ares_expedition.dto.api.NewGameConfigDTO;
import com.ares_expedition.dto.deserializer.IntegerKeyDeserializer;
import com.ares_expedition.dto.websocket.messages.output.GameStateMessageOutputDTO;
import com.ares_expedition.enums.game.GlobalParameterNameEnum;
import com.ares_expedition.enums.game.PhaseEnum;
import com.ares_expedition.model.player_state.PlayerState;
import com.ares_expedition.model.player_state.subclass.substates.GlobalParameter;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

public class Game {
    private String gameId;
    private List<Integer> deck = new ArrayList<>();
    private List<Integer> discard = new ArrayList<>();
    private List<String> groupPlayerId = new ArrayList<>();
    private Map<String, Boolean> groupPlayerReady = new HashMap<>();
    private PhaseEnum currentPhase;
    private LinkedHashSet<PhaseEnum> selectedPhase = new LinkedHashSet<>();
    //@JsonDeserialize(keyUsing = IntegerKeyDeserializer.class)
    private Map<String, PlayerState> groupPlayerState = new HashMap<>();
    private Boolean gameStarted;
    private List<GlobalParameter> globalParameters = new ArrayList<>();

    public Game() {
    }
    
    Game(NewGameConfigDTO gameConfig){

    }

    public Game(
        String gameId, List<Integer> deck, List<Integer> discard, List<String> groupPlayerId,
        PhaseEnum currentPhase, List<GlobalParameter> parameters) {
            this.gameId = gameId;
            this.deck = deck;
            this.discard = discard;
            this.groupPlayerId = groupPlayerId;
            this.currentPhase = currentPhase;
            this.globalParameters = parameters;
    }
        
    public String getGameId() {
        return this.gameId;
    }

    public void setGameId(String gameId) {
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

    public List<String> getGroupPlayerId(){
        return this.groupPlayerId;
    }

    public void setGroupPlayerId(List<String> groupPlayerId){
        this.groupPlayerId = groupPlayerId;
    }

    public Map<String, Boolean> getGroupPlayerReady(){
        return this.groupPlayerReady;
    }

    public boolean getAllPlayersReady(){
        for(Map.Entry<String, Boolean> entry : groupPlayerReady.entrySet()){
            if(!entry.getValue()){
                return false;
            }
        };
        return true;
    }

    public void setGroupPlayerReady(Map<String, Boolean> groupReady){
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

    public void setPlayerReady(String playerId, Boolean ready){
        this.groupPlayerReady.replace(playerId, ready);
    }

    public void setAllPlayersNotReady(){
        for(String playerId: this.groupPlayerId){
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
        
        // Empties the linkedHashSet and insert back the sorted elements in it
        selectedPhase.clear();
        selectedPhase.addAll(sortedList);
    }
    
    public LinkedHashSet<PhaseEnum>getPhaseSelected(){
        return this.selectedPhase;
    }

    public void setPlayerState(String playerId, PlayerState state){
        this.groupPlayerState.put(playerId, state);
    }

    public Boolean getGameStarted() {
        return gameStarted;
    }

    public void setGameStarted(Boolean gameStarted) {
        this.gameStarted = gameStarted;
    }

    public void applyGlobalParameterIncreaseEop() {
        //add all addEndOfPhase to current game parameter steps
        for (PlayerState state : this.groupPlayerState.values()) {
            for(GlobalParameter p: state.getGlobalParameter()){
                if(p.getAddEop()==0){continue;}
                this.increaseParameter(p.getName(), p.getAddEop());
            }
        }

        //Copy game parameter into player's parameters
        for (PlayerState state : this.groupPlayerState.values()) {
            state.setGlobalParameter(this.globalParameters);
        }
    }
    private void increaseParameter(GlobalParameterNameEnum parameter, Integer addEop) {
        for(GlobalParameter p: this.globalParameters) {
            if(p.getName()==parameter){
                p.increaseStep(addEop);
                return;
            }
        }
    }
    public List<GlobalParameter> getGlobalParameters() {
        return globalParameters;
    }

    public void setGlobalParameters(List<GlobalParameter> globalParameters) {
        this.globalParameters = globalParameters;
    }

    public static Game createGame(NewGameConfigDTO gameConfig) {
        return new Game(gameConfig);
    }

    public Map<String, PlayerState> getGroupPlayerState() {
        return groupPlayerState;
    }

    public void setGroupPlayerState(Map<String, PlayerState> groupPlayerState) {
        this.groupPlayerState = groupPlayerState;
    }
}