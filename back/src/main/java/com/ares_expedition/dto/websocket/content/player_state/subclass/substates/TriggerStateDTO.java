package com.ares_expedition.dto.websocket.content.player_state.subclass.substates;

import java.util.List;
import com.ares_expedition.model.player_state.subclass.substates.TriggerState;
import com.fasterxml.jackson.annotation.JsonProperty;

public class TriggerStateDTO {
    @JsonProperty("pci")
    List<Number> playedCardsId;
    @JsonProperty("aci")
    List<Number> activeCardsId;
    @JsonProperty("aoratc")
    List<Number> activeOnRessourceAddedToCard;
    @JsonProperty("aopi")
    List<Number> activeOnParameterIncrease;
    @JsonProperty("aopc")
    List<Number> activeOnPlayedCard;
    @JsonProperty("aogt")
    List<Number> activeOnGainedTag;
    @JsonProperty("acmt")
    List<Number> activeCostModTrigger;

    public TriggerStateDTO(){
    }

    public TriggerStateDTO(TriggerState state){
        this.playedCardsId = state.getPlayedCardsId();
        this.activeCardsId = state.getActiveCardsId();
        this.activeOnRessourceAddedToCard = state.getActiveOnRessourceAddedToCard();
        this.activeOnParameterIncrease = state.getActiveOnParameterIncrease();
        this.activeOnPlayedCard = state.getActiveOnPlayedCard();
        this.activeOnGainedTag = state.getActiveOnGainedTag();
        this.activeCostModTrigger = state.getActiveCostModTrigger();
    }

    public List<Number> getPlayedCardsId() {
        return playedCardsId;
    }
    public void setPlayedCardsId(List<Number> playedCardsId) {
        this.playedCardsId = playedCardsId;
    }
    public List<Number> getActiveCardsId() {
        return activeCardsId;
    }
    public void setActiveCardsId(List<Number> activeCardsId) {
        this.activeCardsId = activeCardsId;
    }
    public List<Number> getActiveOnRessourceAddedToCard() {
        return activeOnRessourceAddedToCard;
    }
    public void setActiveOnRessourceAddedToCard(List<Number> activeOnRessourceAddedToCard) {
        this.activeOnRessourceAddedToCard = activeOnRessourceAddedToCard;
    }
    public List<Number> getActiveOnParameterIncrease() {
        return activeOnParameterIncrease;
    }
    public void setActiveOnParameterIncrease(List<Number> activeOnParameterIncrease) {
        this.activeOnParameterIncrease = activeOnParameterIncrease;
    }
    public List<Number> getActiveOnPlayedCard() {
        return activeOnPlayedCard;
    }
    public void setActiveOnPlayedCard(List<Number> activeOnPlayedCard) {
        this.activeOnPlayedCard = activeOnPlayedCard;
    }
    public List<Number> getActiveOnGainedTag() {
        return activeOnGainedTag;
    }
    public void setActiveOnGainedTag(List<Number> activeOnGainedTag) {
        this.activeOnGainedTag = activeOnGainedTag;
    }
    public List<Number> getActiveCostModTrigger() {
        return activeCostModTrigger;
    }
    public void setActiveCostModTrigger(List<Number> activeCostModTrigger) {
        this.activeCostModTrigger = activeCostModTrigger;
    }
}
