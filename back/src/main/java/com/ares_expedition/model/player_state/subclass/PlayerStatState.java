package com.ares_expedition.model.player_state.subclass;

import com.ares_expedition.dto.websocket.content.player_state.subclass.PlayerStatStateDTO;
import com.ares_expedition.enums.game.GlobalConstants;

public class PlayerStatState {
    private Object selectedPhaseRound;
    private Object increasedParameter;
    private int cardSeen = GlobalConstants.STARTING_HAND_SIZE;

    public PlayerStatState(){};

    PlayerStatState(PlayerStatStateDTO dto){
        this.selectedPhaseRound = dto.getSelectedPhaseRound();
        this.increasedParameter = dto.getIncreasedParameter();
        this.cardSeen = dto.getCardSeen();
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

    public int getCardSeen() {
        return cardSeen;
    }

    public void setCardSeen(int cardSeen) {
        this.cardSeen = cardSeen;
    }
    
    public void addSeenCard(int quantity) {
        this.cardSeen += quantity;
    }
}
