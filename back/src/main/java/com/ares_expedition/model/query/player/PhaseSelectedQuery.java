package com.ares_expedition.model.query.player;

import com.ares_expedition.enums.game.PhaseEnum;
import com.ares_expedition.model.query.BaseQuery;

public class PhaseSelectedQuery extends BaseQuery {
    PhaseEnum phase;
    
    public PhaseSelectedQuery(){
    }
    
    public PhaseEnum getPhase() {
        return phase;
    }
    
    public void setPhase(PhaseEnum phase) {
        this.phase = phase;
    }
}
