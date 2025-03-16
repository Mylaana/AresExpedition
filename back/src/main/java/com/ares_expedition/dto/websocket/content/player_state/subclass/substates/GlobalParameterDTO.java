package com.ares_expedition.dto.websocket.content.player_state.subclass.substates;

import com.ares_expedition.enums.game.GlobalParameterNameEnum;
import com.ares_expedition.model.player_state.subclass.substates.GlobalParameter;
import com.fasterxml.jackson.annotation.JsonProperty;

public class GlobalParameterDTO {
    @JsonProperty("n")
    GlobalParameterNameEnum name;
    @JsonProperty("s")
    Integer step;
    @JsonProperty("ae")
    Integer addEop;

    GlobalParameterDTO(){
    }
    public GlobalParameterDTO(GlobalParameter state){
        this.name = state.getName();
        this.step = state.getStep();
        this.addEop = state.getAddEop();
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
