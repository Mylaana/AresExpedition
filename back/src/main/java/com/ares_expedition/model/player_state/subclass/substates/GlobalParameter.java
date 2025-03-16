package com.ares_expedition.model.player_state.subclass.substates;

import com.ares_expedition.dto.websocket.content.player_state.subclass.substates.GlobalParameterDTO;
import com.ares_expedition.enums.game.GlobalConstants;
import com.ares_expedition.enums.game.GlobalParameterNameEnum;

public class GlobalParameter {
    GlobalParameterNameEnum name;
    Integer step = 0;
    Integer maxStep;
    Integer addEop = 0;

    GlobalParameter(){

    }
    public GlobalParameter(GlobalParameterDTO dto){
        this.name = dto.getName();
        this.step = dto.getStep();
        this.addEop = dto.getAddEop();
        this.setMaxStep(this.name);
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
    public Integer getMaxStep() {
        return maxStep;
    }
    public Integer getAddEop() {
        return addEop;
    }
    public void setAddEop(Integer addEop) {
        this.addEop = addEop;
    }
    public void setMaxStep(GlobalParameterNameEnum name) {
        switch (name) {
            case INFRASTRUCTURE:
                this.maxStep = GlobalConstants.GLOBAL_PARAMETER_INFRASTRUCTURE_MAXSTEP;
                break;

            case OXYGEN:
                this.maxStep = GlobalConstants.GLOBAL_PARAMETER_OXYGEN_MAXSTEP;
                break;

            case TEMPERATURE:
                this.maxStep =  GlobalConstants.GLOBAL_PARAMETER_TEMPERATURE_MAXSTEP;
                break;

            case OCEAN:
                this.maxStep =  GlobalConstants.GLOBAL_PARAMETER_OCEAN_MAXSTEP;
                break;

            default:
                this.maxStep = 0;
                break;
        }  
    }
    public void increaseStep(Integer addStep) {
        this.step = Math.min(this.step + addStep, this.maxStep);
        this.addEop = 0;
    }

    public GlobalParameterDTO toJson(){
        return new GlobalParameterDTO(this);
    }
    public static GlobalParameter fromJson(GlobalParameterDTO dto) {
        return new GlobalParameter(dto);
    }
}
