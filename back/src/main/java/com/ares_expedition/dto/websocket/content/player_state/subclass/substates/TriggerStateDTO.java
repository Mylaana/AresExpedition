package com.ares_expedition.dto.websocket.content.player_state.subclass.substates;

import java.util.List;
import com.ares_expedition.model.player_state.subclass.substates.TriggerState;
import com.fasterxml.jackson.annotation.JsonProperty;

public class TriggerStateDTO {
    @JsonProperty("pci")
    List<String> playedCardsId;
    @JsonProperty("aci")
    List<String> activeCardsId;
    @JsonProperty("aoratc")
    List<String> activeOnRessourceAddedToCard;
    @JsonProperty("aopi")
    List<String> activeOnParameterIncrease;
    @JsonProperty("aopc")
    List<String> activeOnPlayedCard;
    @JsonProperty("aogt")
    List<String> activeOnGainedTag;
    @JsonProperty("acmt")
    List<String> activeCostModTrigger;

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

    public List<String> getPlayedCardsId() {
        return playedCardsId;
    }
    public void setPlayedCardsId(List<String> playedCardsId) {
        this.playedCardsId = playedCardsId;
    }
    public List<String> getActiveCardsId() {
        return activeCardsId;
    }
    public void setActiveCardsId(List<String> activeCardsId) {
        this.activeCardsId = activeCardsId;
    }
    public List<String> getActiveOnRessourceAddedToCard() {
        return activeOnRessourceAddedToCard;
    }
    public void setActiveOnRessourceAddedToCard(List<String> activeOnRessourceAddedToCard) {
        this.activeOnRessourceAddedToCard = activeOnRessourceAddedToCard;
    }
    public List<String> getActiveOnParameterIncrease() {
        return activeOnParameterIncrease;
    }
    public void setActiveOnParameterIncrease(List<String> activeOnParameterIncrease) {
        this.activeOnParameterIncrease = activeOnParameterIncrease;
    }
    public List<String> getActiveOnPlayedCard() {
        return activeOnPlayedCard;
    }
    public void setActiveOnPlayedCard(List<String> activeOnPlayedCard) {
        this.activeOnPlayedCard = activeOnPlayedCard;
    }
    public List<String> getActiveOnGainedTag() {
        return activeOnGainedTag;
    }
    public void setActiveOnGainedTag(List<String> activeOnGainedTag) {
        this.activeOnGainedTag = activeOnGainedTag;
    }
    public List<String> getActiveCostModTrigger() {
        return activeCostModTrigger;
    }
    public void setActiveCostModTrigger(List<String> activeCostModTrigger) {
        this.activeCostModTrigger = activeCostModTrigger;
    }
}
