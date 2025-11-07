package com.ares_expedition.model.player_state;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.ares_expedition.dto.api.CreatePlayerDTO;
import com.ares_expedition.dto.api.NewGameConfigDTO;
import com.ares_expedition.dto.websocket.content.player_state.PlayerStateDTO;
import com.ares_expedition.dto.websocket.content.player_state.subclass.PlayerPhaseCardStateDTO;
import com.ares_expedition.enums.game.MilestonesEnum;
import com.ares_expedition.enums.game.PhaseEnum;
import com.ares_expedition.enums.game.ScanKeepOptionsEnum;
import com.ares_expedition.model.core.Ocean;
import com.ares_expedition.model.player_state.subclass.PlayerEventState;
import com.ares_expedition.model.player_state.subclass.PlayerGlobalParameterState;
import com.ares_expedition.model.player_state.subclass.PlayerInfoState;
import com.ares_expedition.model.player_state.subclass.PlayerOtherState;
import com.ares_expedition.model.player_state.subclass.PlayerPhaseCardState;
import com.ares_expedition.model.player_state.subclass.PlayerProjectCardState;
import com.ares_expedition.model.player_state.subclass.PlayerRessourceState;
import com.ares_expedition.model.player_state.subclass.PlayerScoreState;
import com.ares_expedition.model.player_state.subclass.PlayerStatState;
import com.ares_expedition.model.player_state.subclass.PlayerTagState;
import com.ares_expedition.model.player_state.subclass.substates.EventState;
import com.ares_expedition.model.player_state.subclass.substates.GlobalParameter;
import com.ares_expedition.model.player_state.subclass.substates.OceanFlippedBonus;
import com.ares_expedition.model.player_state.subclass.substates.PhaseCard;
import com.ares_expedition.model.player_state.subclass.substates.TriggerState;
import com.ares_expedition.repository.player_state.PlayerStateData;

public class PlayerState {
    private PlayerInfoState infoState = new PlayerInfoState();
    private PlayerScoreState scoreState = new PlayerScoreState();
    private PlayerTagState tagState = new PlayerTagState();
    private PlayerRessourceState ressourceState = new PlayerRessourceState();
    private PlayerProjectCardState projectCardState = new PlayerProjectCardState();
    private PlayerPhaseCardState phaseCardState = new PlayerPhaseCardState();
    private PlayerGlobalParameterState globalParameterState = new PlayerGlobalParameterState();
    private PlayerEventState eventState = new PlayerEventState();
    private PlayerStatState statState = new PlayerStatState();
    private PlayerOtherState otherState = new PlayerOtherState();

    private List<String> researchResolved = new ArrayList<>();
    private Integer researchResolvedKeep;

    PlayerState(){
    }
    
    public PlayerState(CreatePlayerDTO playerConfig){
        this.infoState.setId(playerConfig.getId());
        this.infoState.setName(playerConfig.getName());
        this.infoState.setColor(playerConfig.getColor());
    }

    public PlayerState(PlayerStateDTO dto) {
        this.infoState = PlayerInfoState.fromJson(dto.getInfoState());
        this.scoreState = PlayerScoreState.fromJson(dto.getScoreState());
        this.tagState = PlayerTagState.fromJson(dto.getTagState());
        this.ressourceState = PlayerRessourceState.fromJson(dto.getRessourceState());
        this.projectCardState = PlayerProjectCardState.fromJson(dto.getProjectCardState());
        this.phaseCardState = PlayerPhaseCardState.fromJson(dto.getPhaseCardState());
        this.globalParameterState = PlayerGlobalParameterState.fromJson(dto.getGlobalParameterState());
        this.eventState = PlayerEventState.fromJson(dto.getEventState());
        this.otherState = PlayerOtherState.fromJson(dto.getOtherState());
        this.statState = PlayerStatState.fromJson(dto.getStatState());
    }

    //=============================================================
    //Info
    public PlayerInfoState getInfoState() {
        return this.infoState;
    }
    public void setInfoState(PlayerInfoState state) {
        this.infoState = state;
    }

    public String getId() {
        return this.infoState.getId();
    }

    public void setId(String id) {
        this.infoState.setId(id);
    }

    public String getName() {
        return this.infoState.getName();
    }

    public void setName(String name) {
        this.infoState.setName(name);
    }

    public String getColor() {
        return this.infoState.getColor();
    }

    public void setColor(String color) {
        this.infoState.setColor(color);
    }


    //=============================================================
    //Score
    public PlayerScoreState getScoreState() {
        return scoreState;
    }

    public void setScoreState(PlayerScoreState scoreState) {
        this.scoreState = scoreState;
    }

    public Integer getTerraformingRating() {
        return scoreState.getTerraformingRating();
    }

    public void setTerraformingRating(Integer terraformingRating) {
        this.scoreState.setTerraformingRating(terraformingRating);
    }

    public Integer getForest() {
        return this.scoreState.getForest();
    }

    public void setForest(Integer forest) {
        this.scoreState.setForest(forest);
    }

    public Integer getVp() {
        return this.scoreState.getVp();
    }

    public void setVp(Integer vp) {
        this.scoreState.setVp(vp);
    }

    public List<MilestonesEnum> getClaimedMilestone() {
        return this.scoreState.getClaimedMilestone();
    }

    public void setMilestoneCount(List<MilestonesEnum> milestones) {
        this.scoreState.setClaimedMilestone(milestones);
    }


    //=============================================================
    //Tags
    public PlayerTagState getTagState() {
        return tagState;
    }

    public void setTagState(PlayerTagState tagState) {
        this.tagState = tagState;
    }
    /*/
    public List<Map<String, Object>> getTags() {
        return this.tagState.getTags();
    }

    public void setTags(List<Map<String, Object>> tags) {
        this.tagState.setTags(tags);
    }
        */


    //=============================================================
    //Ressources
    public PlayerRessourceState getRessourceState() {
        return ressourceState;
    }

    public void setRessourceState(PlayerRessourceState resssourceState) {
        this.ressourceState = resssourceState;
    }

    public List<Map<String, Object>> getRessource() {
        return this.ressourceState.getRessources();
    }

    public void setRessource(List<Map<String, Object>> ressource) {
        this.ressourceState.setRessources(ressource);;
    }

    public Integer getCardsProduction(){
        return this.ressourceState.getCardsProduction();
    }


    //=============================================================
    //Project Cards
    public PlayerProjectCardState getProjectCardState() {
        return projectCardState;
    }

    public void setProjectCardState(PlayerProjectCardState projectCardState) {
        this.projectCardState = projectCardState;
    }

    public List<String> getHand() {
        return projectCardState.getHand();
    }

    public void setHand(List<String> hand) {
        this.projectCardState.setHand(hand);
    }

    public List<String> getHandCorporations() {
        return projectCardState.getHandCorporations();
    }

    public void setHandCorporations(List<String> handCorporations) {
        this.projectCardState.setHandCorporations(handCorporations);
    }

    public Map<String,Object> getCardPlayed() {
        return projectCardState.getCardPlayed();
    }

    public void setCardPlayed(Map<String,Object> playedProjectIdList) {
        this.projectCardState.setCardPlayed(playedProjectIdList);
    }

    public TriggerState getTriggers() {
        return this.projectCardState.getTriggers();
    }

    public void setTriggers(TriggerState triggers) {
        this.projectCardState.setTriggers(triggers);
    }

    public Integer getHandMaximumSize() {
        return this.projectCardState.getHandMaximumSize();
    }

    public void setHandMaximumSize(Integer handMaximumSize) {
        this.projectCardState.setHandMaximumSize(handMaximumSize);
    }

    //=============================================================
    //Phase Cards
    public PlayerPhaseCardState getPhaseCardState() {
        return phaseCardState;
    }

    public void setPhaseCardState(PlayerPhaseCardState phaseCardState) {
        this.phaseCardState = phaseCardState;
    }

    public List<PhaseCard> getPhaseCards() {
        return this.phaseCardState.getPhaseCards();
    }

    public void setPhaseCards(List<PhaseCard> phaseCards) {
        this.phaseCardState.setPhaseCards(phaseCards);
    }

    public PhaseEnum getSelectedPhase() {
        return this.phaseCardState.getSelectedPhase();
    }

    public void setSelectedPhase(PhaseEnum selectedPhase) {
        this.phaseCardState.setSelectedPhase(selectedPhase);
    }

    public static PlayerPhaseCardState fromJson(PlayerPhaseCardStateDTO dto) {
        return new PlayerPhaseCardState(dto);
    }    

    //=============================================================
    //Global parameters
    public PlayerGlobalParameterState getGlobalParameterState() {
        return globalParameterState;
    }

    public void setGlobalParameterState(PlayerGlobalParameterState globalParameterState) {
        this.globalParameterState = globalParameterState;
    }

    
    public List<GlobalParameter> getGlobalParameter() {
        return globalParameterState.getGlobalParameters();
    }

    public void setGlobalParameter(List<GlobalParameter> globalParameter) {
        this.globalParameterState.setGlobalParameters(globalParameter);
    }

    public void setOceanFlippedBonus(OceanFlippedBonus oceanBonuses){
        this.globalParameterState.setOceanFlippedBonus(oceanBonuses);
    }

    //=============================================================
    //Events
    public PlayerEventState getEventState() {
        return eventState;
    }

    public void setEventState(PlayerEventState eventState) {
        this.eventState = eventState;
    }

    public void addEvent(EventState event) {
        this.eventState.addEvent(event);
    }

    public void addEventOceans(List<Ocean> oceans) {
        this.eventState.addEventOceans(oceans);
    }

    public void addEventDrawCards(List<String> cards, Integer thenDiscard){
        this.eventState.addEventDrawCards(cards, thenDiscard);
    }

    public void addEventResearchCards(List<String> cards, Integer keep){
        this.eventState.addEventResearchCards(cards, keep);
    }

    public void addEventScanKeepCards(List<String> cards, Integer keep, ScanKeepOptionsEnum options){
        this.eventState.addEventScanKeepCards(cards, keep, options);
    }

    //=============================================================
    //Other
    public PlayerOtherState getOtherState() {
        return otherState;
    }

    public void setOtherState(PlayerOtherState otherState) {
        this.otherState = otherState;
    }


    public Integer getSellCardValueMod() {
        return this.otherState.getSellCardValueMod();
    }

    public void setSellCardValueMod(Integer sellCardValueMod) {
        this.otherState.setSellCardValueMod(sellCardValueMod);
    }

    public Map<String, Object> getResearch() {
        return this.otherState.getResearch();
    }

    public void setResearch(Map<String, Object> research) {
        this.otherState.setResearch(research);
    }

    public static PlayerState fromJson(PlayerStateDTO dto) {
        return new PlayerState(dto);
    }
    public PlayerStateDTO toJson() {
        return new PlayerStateDTO(this);
    }

    public static Map<String, PlayerState> createGamePlayerStates(NewGameConfigDTO gameConfig){
        Map<String, PlayerState> playerStates = new HashMap<>();

        for(CreatePlayerDTO player: gameConfig.getPlayers()){
            playerStates.put(player.getId(), new PlayerState(player));
        }

        return playerStates;
    }

    public List<String> getResearchResolved() {
        return researchResolved;
    }

    public void setResearchResolved(List<String> researchResolved, Integer keep) {
        this.researchResolved = researchResolved;
        this.researchResolvedKeep = keep;
    }

    public Integer getResearchResolvedKeep(){
        return this.researchResolvedKeep;
    }

    public void resetResearchResolved() {
        this.researchResolved.clear();
    }

    public Boolean isResearchResolved() {
        return this.researchResolved.size()!=0;
    }
    
    public PlayerStatState getStatState() {
        return statState;
    }

    public void setStatState(PlayerStatState statState) {
        this.statState = statState;
    }

    public void addSeenCard(int quantity){
        this.statState.addSeenCard(quantity);
    }

    public PlayerStateData toData(){
        return new PlayerStateData(this);
    }

    public static Map<String, PlayerStateData> ToDataMap(Map<String, PlayerState> stateMap){
        Map<String, PlayerStateData> dataMap = new HashMap<>();
        for(Map.Entry<String, PlayerState> entry: stateMap.entrySet()){
            PlayerStateData data = PlayerState.toData(entry.getValue());
            dataMap.put(entry.getKey(), data);
        }
        return dataMap;
    }

    public static PlayerStateData toData(PlayerState state){
        return new PlayerStateData(state);
    }
}
