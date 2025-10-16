package com.ares_expedition.model.core;

import java.util.HashMap;
import java.util.Map;

import com.ares_expedition.enums.game.GameContentNameEnum;
import com.ares_expedition.model.core.subModel.GameOption;

public class GameOptions {
    private Map<GameContentNameEnum, GameOption> options = new HashMap<>();

    public GameOptions(){
    }
    
    public GameOptions(Map<GameContentNameEnum, GameOption> gameOptions){
        this.options = gameOptions;
    }
    public Boolean isContentActive(GameContentNameEnum name){
        if(!this.options.containsKey(name)){return false;}
        return this.options.get(name).getActive();
    }

    public Map<GameContentNameEnum, GameOption> getOptions() {
        return options;
    }

    public void setOptions(Map<GameContentNameEnum, GameOption> options){
        this.options = options;
    }
}
