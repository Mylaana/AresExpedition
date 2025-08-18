package com.ares_expedition.dto.websocket.content.player_state.subclass;

import com.ares_expedition.model.player_state.subclass.PlayerStatState;
import com.fasterxml.jackson.annotation.JsonProperty;

public class PlayerStatStateDTO {
    @JsonProperty("spr")
    private Object selectedPhaseRound;
    @JsonProperty("ip")
    private Object increasedParameter;
    @JsonProperty("c")
    private Object cards;

    PlayerStatStateDTO(){};
    public PlayerStatStateDTO(PlayerStatState state){
        this.selectedPhaseRound = state.getSelectedPhaseRound();
        this.increasedParameter = state.getIncreasedParameter();
        this.cards = state.getCards();
    }
    public Object getSelectedPhaseRound() {
        return selectedPhaseRound;
    }
    public void setSelectedPhaseRound(Object selectedPhaseRound) {
        this.selectedPhaseRound = selectedPhaseRound;
    }
    public Object getIncreasedParameter() {
        return increasedParameter;
    }
    public void setIncreasedParameter(Object increasedParameter) {
        this.increasedParameter = increasedParameter;
    }
    public Object getCards() {
        return cards;
    }
    public void setCards(Object cards) {
        this.cards = cards;
    }
}
