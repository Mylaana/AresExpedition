package com.ares_expedition.model.core;

import java.util.Map;

public class GameOptions {
    Boolean merger;

    GameOptions(){
    }
    
    public GameOptions(Map<String, Object> gameOptions){
        this.merger = (boolean) gameOptions.get("merger");
    }

    public Boolean getMerger() {
        return merger;
    }

    public void setMerger(Boolean merger) {
        this.merger = merger;
    }

    
}
