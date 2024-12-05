package com.ares_expedition.dto.websocket.content.player;

import com.ares_expedition.dto.websocket.content.BaseContentDTO;
import com.ares_expedition.enums.game.PhaseEnum;

public class PhaseSelectedContentDTO extends BaseContentDTO {
    PhaseEnum phase;
    
    public PhaseSelectedContentDTO(){
    }
    
    public PhaseEnum getPhase() {
        return phase;
    }
    
    public void setPhase(PhaseEnum phase) {
        this.phase = phase;
    }
}
