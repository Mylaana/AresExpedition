package com.ares_expedition.model.player_state.subclass.substates;
import java.util.List;

import com.ares_expedition.dto.websocket.content.player_state.subclass.substates.TriggerStateDTO;

public class TriggerState {
    List<String> playedCardsId;
    List<String> activeCardsId;
    List<String> activeOnRessourceAddedToCard;
    List<String> activeOnParameterIncrease;
    List<String> activeOnPlayedCard;
    List<String> activeOnGainedTag;
    List<String> activeCostModTrigger;

    public TriggerState(){
    }

    TriggerState(TriggerStateDTO dto){
        this.playedCardsId = dto.getPlayedCardsId();
        this.activeCardsId = dto.getActiveCardsId();
        this.activeOnRessourceAddedToCard = dto.getActiveOnRessourceAddedToCard();
        this.activeOnParameterIncrease = dto.getActiveOnParameterIncrease();
        this.activeOnPlayedCard = dto.getActiveOnPlayedCard();
        this.activeOnGainedTag = dto.getActiveOnGainedTag();
        this.activeCostModTrigger = dto.getActiveCostModTrigger();
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

    public static TriggerState fromJson(TriggerStateDTO dto) {
        return new TriggerState(dto);
    }
    public TriggerStateDTO toJson() {
        return new TriggerStateDTO(this);
    }
}
