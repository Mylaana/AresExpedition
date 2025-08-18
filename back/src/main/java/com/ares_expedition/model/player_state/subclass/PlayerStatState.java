package com.ares_expedition.model.player_state.subclass;

import com.ares_expedition.dto.websocket.content.player_state.subclass.PlayerStatStateDTO;

public class PlayerStatState {
    private Object selectedPhaseRound;
    private Object increasedParameter;
    private Object cards;

    public PlayerStatState(){};

    PlayerStatState(PlayerStatStateDTO dto){
        this.selectedPhaseRound = dto.getSelectedPhaseRound();
        this.increasedParameter = dto.getIncreasedParameter();
        this.cards = dto.getCards();
    }

    public Object getSelectedPhaseRound() {
        return selectedPhaseRound;
    }

    public void setSelectedPhaseRound(Object selectedPhaseRound) {
        this.selectedPhaseRound = selectedPhaseRound;
    }

    public static PlayerStatState fromJson(PlayerStatStateDTO dto) {
        return new PlayerStatState(dto);
    }

    public PlayerStatStateDTO toJson() {
        return new PlayerStatStateDTO(this);
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
