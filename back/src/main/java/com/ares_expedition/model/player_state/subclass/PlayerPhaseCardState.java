package com.ares_expedition.model.player_state.subclass;

import java.util.ArrayList;
import java.util.List;


import com.ares_expedition.dto.websocket.content.player_state.subclass.PlayerPhaseCardStateDTO;
import com.ares_expedition.dto.websocket.content.player_state.subclass.substates.PhaseCardDTO;
import com.ares_expedition.enums.game.PhaseEnum;
import com.ares_expedition.model.player_state.subclass.substates.PhaseCard;
import com.fasterxml.jackson.annotation.JsonProperty;

public class PlayerPhaseCardState {
    private List<PhaseCard> phaseCards = new ArrayList<PhaseCard>();
    private PhaseEnum selectedPhase;
    private PhaseEnum previousSelectedPhase;

    //upon phase activation bonus collected
    private Boolean constructionBonusCollected;
    private Boolean actionBonusCollected;
    private Boolean firstProductionCollected;
    private Boolean secondProductionCollected;
    private Boolean researchBonusCollected;
    private List<String> producedCardList;
    private Object producedResources;

    public PlayerPhaseCardState() {
    }

    public PlayerPhaseCardState(PlayerPhaseCardStateDTO dto) {
        for (PhaseCardDTO card : dto.getPhaseCards()) {
            this.phaseCards.add(PhaseCard.fromJson(card));
        }
        this.selectedPhase = dto.getSelectedPhase();
        this.previousSelectedPhase = dto.getPreviousSelectedPhase();

        this.constructionBonusCollected = dto.getConstructionBonusCollected();
        this.actionBonusCollected = dto.getActionBonusCollected();
        this.firstProductionCollected = dto.getFirstProductionCollected();
        this.secondProductionCollected = dto.getSecondProductionCollected();
        this.researchBonusCollected = dto.getResearchBonusCollected();
        this.producedCardList = dto.getProducedCardList();
        this.producedResources = dto.getProducedResources();
    }

    public PhaseEnum getSelectedPhase() {
        return selectedPhase;
    }

    public void setSelectedPhase(PhaseEnum selectedPhase) {
        this.selectedPhase = selectedPhase;
    }
    
    public List<PhaseCard> getPhaseCards() {
        return phaseCards;
    }
    
    public void setPhaseCards(List<PhaseCard> phaseCards) {
        this.phaseCards = phaseCards;
    }

    public static PlayerPhaseCardState fromJson(PlayerPhaseCardStateDTO dto) {
        return new PlayerPhaseCardState(dto);
    }

    public PlayerPhaseCardStateDTO toJson() {
        return new PlayerPhaseCardStateDTO(this);
    }

    public PhaseEnum getPreviousSelectedPhase() {
        return previousSelectedPhase;
    }

    public void setPreviousSelectedPhase(PhaseEnum previousSelectedPhase) {
        this.previousSelectedPhase = previousSelectedPhase;
    }
    
    public void newRound() {
        this.previousSelectedPhase = this.selectedPhase;
        this.selectedPhase = PhaseEnum.UNDEFINED;
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
