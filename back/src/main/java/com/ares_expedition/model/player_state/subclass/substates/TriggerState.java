package com.ares_expedition.model.player_state.subclass.substates;
import java.util.List;

import com.ares_expedition.dto.websocket.content.player_state.subclass.substates.TriggerStateDTO;

public class TriggerState {
    List<Number> playedCardsId;
    List<Number> activeCardsId;
    List<Number> activeOnRessourceAddedToCard;
    List<Number> activeOnParameterIncrease;
    List<Number> activeOnPlayedCard;
    List<Number> activeOnGainedTag;
    List<Number> activeCostModTrigger;

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

    public static TriggerState fromJson(TriggerStateDTO dto) {
        return new TriggerState(dto);
    }
    public TriggerStateDTO toJson() {
        return new TriggerStateDTO(this);
    }
}
