package com.ares_expedition.model.core;

import java.util.*;
import java.util.Map.Entry;
import java.util.stream.Collectors;

import com.ares_expedition.dto.api.CreatePlayerDTO;
import com.ares_expedition.dto.api.NewGameConfigDTO;
import com.ares_expedition.dto.websocket.messages.output.GameStateMessageOutputDTO;
import com.ares_expedition.enums.game.CardTypeEnum;
import com.ares_expedition.enums.game.GameStatusEnum;
import com.ares_expedition.enums.game.GlobalConstants;
import com.ares_expedition.enums.game.GlobalParameterNameEnum;
import com.ares_expedition.enums.game.PhaseEnum;
import com.ares_expedition.enums.game.RessourceEnum;
import com.ares_expedition.enums.game.ScanKeepOptionsEnum;
import com.ares_expedition.model.player_state.PlayerState;
import com.ares_expedition.model.player_state.subclass.substates.GlobalParameter;
import com.ares_expedition.model.player_state.subclass.substates.OceanFlippedBonus;
import com.ares_expedition.repository.JsonGameDataHandler;
import com.ares_expedition.repository.core.GameData;

public class Game {
    private String gameId;
    private List<String> deck = new ArrayList<>();
    private List<String> discard = new ArrayList<>();
    private List<String> groupPlayerId = new ArrayList<>();
    private Map<String, Boolean> groupPlayerReady = new HashMap<>();
    private PhaseEnum currentPhase;
    private LinkedHashSet<PhaseEnum> selectedPhase = new LinkedHashSet<>();
    private Map<String, PlayerState> groupPlayerState = new HashMap<>();
    private GameStatusEnum gameStatus;
    private List<GlobalParameter> globalParameters = new ArrayList<>();
    private List<String> deckCorporations = new ArrayList<>();
    private List<Ocean> oceans = new ArrayList<>();
    private GameOptions gameOptions;

    public Game() {
    }
    
    Game(NewGameConfigDTO gameConfig){
        this.gameId = gameConfig.getGameId();
        this.currentPhase = PhaseEnum.PLANIFICATION;
        this.selectedPhase.add(currentPhase);
        this.groupPlayerState = PlayerState.createGamePlayerStates(gameConfig);
        this.gameStatus = GameStatusEnum.NEW_GAME;
        this.globalParameters = GlobalParameter.createGameGlobalParameters();
        this.gameOptions = new GameOptions(gameConfig.getOptions());
        this.deck = JsonGameDataHandler.getCardsIdList(CardTypeEnum.PROJECT, this.gameOptions);
        this.deckCorporations = JsonGameDataHandler.getCardsIdList(CardTypeEnum.CORPORATION, this.gameOptions);
        this.shuffleDeck(this.deck);
        this.shuffleDeck(this.deckCorporations);

        for(CreatePlayerDTO playerConfig: gameConfig.getPlayers()){
            //groupPlayerId
            groupPlayerId.add(playerConfig.getId());

            //groupPlayerReady
            groupPlayerReady.put(playerConfig.getId(), false);
        }

        //add oceans
        for(Integer i=0; i<9; i++){
            oceans.add(new Ocean(i));
        }
        Collections.shuffle(oceans);
    }

    public Game(
        String gameId, List<String> deck, List<String> discard, List<String> groupPlayerId,
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

    public List<String> getDeck() {
        return this.deck;
    }

    public void setDeck(List<String> deck) {
        this.deck = deck;
    }

    public List<String> getDiscard() {
        return this.discard;
    }

    public void setDiscard(List<String> discard) {
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

    public List<String> drawCards(Integer drawNumber){
        ArrayList<String> result = new ArrayList<String>();
        synchronized(deck){
            checkDeckSize(drawNumber);        
            Integer cardsToDraw = Math.min(drawNumber, this.deck.size());
            
            for(Integer i=0; i<cardsToDraw; i++){
                result.add(this.deck.get(0));
                this.deck.remove(0);
            }
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

    public List<String> drawCorporations(Integer corpNumber) {
        List<String> result = new ArrayList<>();
        result.addAll(deckCorporations.subList(0, Math.min(corpNumber, deckCorporations.size())));
        deckCorporations.subList(0, Math.min(corpNumber, deckCorporations.size())).clear();

        return result;
    }

    public void shuffleDeck(List<String> deck){
        if (this.deck == null) {
            throw new IllegalStateException("Deck must be initialized before shuffling.");
        }
        Collections.shuffle(deck);
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
        gameState.setGameOptions(gameOptions);
        gameState.setCurrentPhase(currentPhase);
        gameState.setGroupReady(groupPlayerReady);
        gameState.setSelectedPhase(selectedPhase);
        gameState.setGroupPlayerStatePublic(this.groupPlayerState);
        gameState.setGameStatus(gameStatus);

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
        this.newRound();
    }

    private void newRound(){
        this.selectedPhase.clear();
        this.selectedPhase.add(PhaseEnum.PLANIFICATION);
        this.currentPhase = this.selectedPhase.getFirst();
        for(Map.Entry<String, PlayerState> entry:  this.groupPlayerState.entrySet()){
            entry.getValue().getPhaseCardState().newRound();
        }
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

    public GameStatusEnum getGameStatus() {
        return gameStatus;
    }

    public void setGameStatus(GameStatusEnum gameStatus) {
        this.gameStatus = gameStatus;
    }
    
    public List<String> getDeckCorporations() {
        return deckCorporations;
    }

    public void setDeckCorporations(List<String> deckCorporations) {
        this.deckCorporations = deckCorporations;
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
        OceanFlippedBonus oceanBonuses = this.getOceanFlippedBonus(this.getOceans());
        for (PlayerState state : this.groupPlayerState.values()) {
            state.setGlobalParameter(this.globalParameters);
            state.setOceanFlippedBonus(oceanBonuses);
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

    public void setStartingHand() {
        for(Map.Entry<String,PlayerState> entry: this.groupPlayerState.entrySet()){
            entry.getValue().setHand(drawCards(GlobalConstants.STARTING_HAND_SIZE));
        }
    }

    public void setStartingHandCorporations() {
        Integer totalCorpNumber = this.deckCorporations.size();
        Integer playerNumber = this.groupPlayerState.entrySet().size();
        Integer corpNumber;
        if(this.getGameOptions().getModeMerger()){
             corpNumber = Math.min(8, totalCorpNumber / playerNumber);
        } else {
            corpNumber = 4;
        }

        //distribute all corps if single player
        if(playerNumber==1){
            corpNumber=totalCorpNumber;
        }

        for(Map.Entry<String,PlayerState> entry: this.groupPlayerState.entrySet()){
            entry.getValue().setHandCorporations(drawCorporations(corpNumber));
        }
    }
    
    public void removeCorporationsFromHands(){
        for(Map.Entry<String,PlayerState> entry: this.groupPlayerState.entrySet()){
            entry.getValue().setHandCorporations(new ArrayList<>());
        } 
    }

    public void fillDiscardPileFromPlayerDiscard() {
        for(Map.Entry<String,PlayerState> entry: this.groupPlayerState.entrySet()){
            List<String> playerDiscard = entry.getValue().getProjectCardState().getHandDiscard();
            this.discard.addAll(playerDiscard);
            playerDiscard.clear();
        }
    }

    public List<Ocean> getOceans() {
        return oceans;
    }

    public void setOceans(List<Ocean> oceans) {
        this.oceans = oceans;
    }

    public List<Ocean> flipOceans(Integer oceanNumber) {
        List<Ocean> oceans = new ArrayList<>();
        for(Integer i=0; i<oceanNumber; i++){
            oceans.add(getOceanToFlip());
        }
        return oceans;
    }

    private Ocean getOceanToFlip() {
        for(Ocean ocean: oceans){
            if(!ocean.getFlipped()){
                ocean.setFlipped(true);
                return ocean;
            }
        }
        return oceans.getLast();
    }

    public List<String> drawFlippedOceanCards(String playerId, List<Ocean> flippedOceans) {
        List<String> drawFromFlipped = new ArrayList<>();

        for(Ocean ocean: flippedOceans){
            Integer cardsToDraw = ocean.getBonuses().get(RessourceEnum.CARD);
            if(cardsToDraw != null){
               drawFromFlipped.addAll(this.drawCards(cardsToDraw));
            }
        }
        return drawFromFlipped;
    }
    public OceanFlippedBonus getOceanFlippedBonus(List<Ocean> oceans){
        OceanFlippedBonus bonuses = new OceanFlippedBonus();
        for(Ocean ocean: oceans){
            if(ocean.getFlipped()){
                bonuses.addFlippedBonus(ocean.getBonuses());
            }
        }
        return bonuses;
    }

    public void applyDrawProduction() {
        for(Map.Entry<String, PlayerState> entry: this.groupPlayerState.entrySet()){
            PlayerState state = entry.getValue();
            Integer productionCards = state.getCardsProduction();
            if(productionCards>0){
                List<String> cardList = drawCards(productionCards);
                state.getEventState().addEventProductionCards(cardList);
            }
        }
    }

    public Boolean isResearchResolved(String playerId){
        return this.groupPlayerState.get(playerId).isResearchResolved();
    }

    public void setResearchResolved(String playerId, List<String> cardList, Integer keep){
        this.groupPlayerState.get(playerId).setResearchResolved(cardList, keep);
    }

    public void resetResearchResolved() {
        for(Entry<String, PlayerState> entry: groupPlayerState.entrySet()){
            entry.getValue().resetResearchResolved();
        }
    }

    public void addEventDrawCardsToPlayer(String playerId, List<String> cards, Integer thenDiscard){
        this.groupPlayerState.get(playerId).addEventDrawCards(cards, thenDiscard);
    }

    public void addEventResearchCardsToPlayer(String playerId, List<String> cards, Integer keep){
        this.groupPlayerState.get(playerId).addEventResearchCards(cards, keep);
    }

    public void addEventScanKeepCardsToPlayer(String playerId, List<String> cards, Integer keep, ScanKeepOptionsEnum options){
        this.groupPlayerState.get(playerId).addEventScanKeepCards(cards, keep, options);
    }

    public boolean isGameOver(){
        for(GlobalParameter p: this.globalParameters){
            if(p.getName()==GlobalParameterNameEnum.INFRASTRUCTURE){
                if(this.gameOptions.getExpansionFoundations()==false){continue;}
                if(this.gameOptions.getModeInfrastructureMandatory()==false){continue;}
            }
            if(p.isMaxedOut()==false){return false;}
        }
        return true;
    }

    public GameOptions getGameOptions() {
        return this.gameOptions;
    }

    public void setGameOptions(GameOptions gameOptions) {
        this.gameOptions = gameOptions;
    }

    public GameData toData(){
        return new GameData(this);
    }

    public static Map<String, GameData> toDataMap(Map<String, Game> gameMap){
        Map<String, GameData> dataMap = new HashMap<>();
        for(Map.Entry<String, Game> entry: gameMap.entrySet()){
            dataMap.put(entry.getKey(), entry.getValue().toData());
        }

        return dataMap;
    }
}