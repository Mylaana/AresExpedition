package com.ares_expedition.repository.core;

import com.ares_expedition.enums.game.GlobalParameterNameEnum;
import com.ares_expedition.model.player_state.subclass.substates.GlobalParameter;

public class GlobalParameterData {
    GlobalParameterNameEnum name;
    Integer step = 0;
    Integer addEop = 0;

    GlobalParameterData(){
    }

    public GlobalParameterData(GlobalParameter parameter){
        this.name = parameter.getName();
        this.step = parameter.getStep();
        this.addEop = parameter.getAddEop();
    }

    public GlobalParameterNameEnum getName() {
        return name;
    }

    public void setName(GlobalParameterNameEnum name) {
        this.name = name;
    }

    public Integer getStep() {
        return step;
    }

    public void setStep(Integer step) {
        this.step = step;
    }

    public Integer getAddEop() {
        return addEop;
    }

    public void setAddEop(Integer addEop) {
        this.addEop = addEop;
    }

    
}
