package com.ares_expedition.dto.websocket.content.player_state.subclass;

import java.util.ArrayList;
import java.util.List;

import com.ares_expedition.dto.websocket.content.player_state.subclass.substates.PhaseCardDTO;
import com.ares_expedition.enums.game.PhaseEnum;
import com.ares_expedition.model.player_state.subclass.PlayerPhaseCardState;
import com.ares_expedition.model.player_state.subclass.substates.PhaseCard;
import com.fasterxml.jackson.annotation.JsonProperty;

public class PlayerPhaseCardStateDTO {
    @JsonProperty("pc")
    private List<PhaseCardDTO> phaseCards = new ArrayList<PhaseCardDTO>();
    @JsonProperty("sp")
    private PhaseEnum selectedPhase;
    @JsonProperty("psp")
    private PhaseEnum previousSelectedPhase;

    //upon phase activation bonus collected
    @JsonProperty("cbc")
    private Boolean constructionBonusCollected;
    @JsonProperty("abc")
    private Boolean actionBonusCollected;
    @JsonProperty("fpc")
    private Boolean firstProductionCollected;
    @JsonProperty("spc")
    private Boolean secondProductionCollected;
    @JsonProperty("rbc")
    private Boolean researchBonusCollected;
    @JsonProperty("pcl")
    private List<String> producedCardList;
    @JsonProperty("pr")
    private Object producedResources;

    PlayerPhaseCardStateDTO() {
    }

    public PlayerPhaseCardStateDTO(PlayerPhaseCardState state) {
        for (PhaseCard card : state.getPhaseCards()) {
            this.phaseCards.add(card.toJson());
        }
        this.selectedPhase = state.getSelectedPhase();
        this.previousSelectedPhase = state.getPreviousSelectedPhase();

        constructionBonusCollected = state.getConstructionBonusCollected();
        actionBonusCollected = state.getActionBonusCollected();
        firstProductionCollected = state.getFirstProductionCollected();
        secondProductionCollected = state.getSecondProductionCollected();
        researchBonusCollected = state.getActionBonusCollected();
        producedCardList = state.getProducedCardList();
        producedResources = state.getProducedResources();
    }

    public List<PhaseCardDTO> getPhaseCards() {
        return phaseCards;
    }

    public void setphaseCards(List<PhaseCardDTO> phaseCards) {
        this.phaseCards = phaseCards;
    }

    public PhaseEnum getSelectedPhase() {
        return selectedPhase;
    }

    public void setSelectedPhase(PhaseEnum selectedPhase) {
        this.selectedPhase = selectedPhase;
    }

    public PhaseEnum getPreviousSelectedPhase() {
        return previousSelectedPhase;
    }

    public void setPreviousSelectedPhase(PhaseEnum previousSelectedPhase) {
        this.previousSelectedPhase = previousSelectedPhase;
    }

    public Boolean getConstructionBonusCollected() {
        return constructionBonusCollected;
    }

    public void setConstructionBonusCollected(Boolean constructionBonusCollected) {
        this.constructionBonusCollected = constructionBonusCollected;
    }

    public Boolean getFirstProductionCollected() {
        return firstProductionCollected;
    }

    public void setFirstProductionCollected(Boolean firstProductionCollected) {
        this.firstProductionCollected = firstProductionCollected;
    }

    public Boolean getSecondProductionCollected() {
        return secondProductionCollected;
    }

    public void setSecondProductionCollected(Boolean secondProductionCollected) {
        this.secondProductionCollected = secondProductionCollected;
    }

    public Boolean getActionBonusCollected() {
        return actionBonusCollected;
    }

    public void setActionBonusCollected(Boolean actionBonusCollected) {
        this.actionBonusCollected = actionBonusCollected;
    }

    public Boolean getResearchBonusCollected() {
        return researchBonusCollected;
    }

    public void setResearchBonusCollected(Boolean researchBonusCollected) {
        this.researchBonusCollected = researchBonusCollected;
    }

    public List<String> getProducedCardList() {
        return producedCardList;
    }

    public void setProducedCardList(List<String> producedCardList) {
        this.producedCardList = producedCardList;
    }

    public Object getProducedResources() {
        return producedResources;
    }

    public void setProducedResources(Object producedResources) {
        this.producedResources = producedResources;
    }  
}
