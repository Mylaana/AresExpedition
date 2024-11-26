package com.ares_expedition.model.query.player;

import java.util.Map;

import com.ares_expedition.enums.game.PhaseEnum;
import com.ares_expedition.model.query.BaseQuery;

public class PhaseSelectedQuery extends BaseQuery {
    PhaseEnum content;
    
    public PhaseSelectedQuery(){
    }

    public PhaseSelectedQuery(PhaseEnum content){
        this.content = content;
    }

    public PhaseSelectedQuery(Map<String, String> data){
        this.content = PhaseEnum.valueOf(data.get("phase"));
    }
    
    public PhaseEnum getContent() {
        return content;
    }
    
    public void setContent(PhaseEnum content) {
        this.content = content;
    }
}
