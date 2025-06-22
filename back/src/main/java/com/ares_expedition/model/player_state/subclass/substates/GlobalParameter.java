package com.ares_expedition.model.player_state.subclass.substates;

import java.util.ArrayList;
import java.util.List;

import com.ares_expedition.dto.websocket.content.player_state.subclass.substates.GlobalParameterDTO;
import com.ares_expedition.enums.game.GlobalConstants;
import com.ares_expedition.enums.game.GlobalParameterNameEnum;
import com.ares_expedition.repository.core.GlobalParameterData;

public class GlobalParameter {
    GlobalParameterNameEnum name;
    Integer step = 0;
    Integer maxStep = 0;
    Integer addEop = 0;

    GlobalParameter(){
    }
    GlobalParameter(GlobalParameterNameEnum name){
        this.name = name;
        if(name==GlobalParameterNameEnum.OCEAN){
            this.step = 0;
        } else {
            this.step = 1;
        }
        this.addEop = 0;
        this.setMaxStep(name);
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
        this.setMaxStep(this.name);
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
            case GlobalParameterNameEnum.INFRASTRUCTURE:
                this.maxStep = GlobalConstants.GLOBAL_PARAMETER_INFRASTRUCTURE_MAXSTEP;
                break;

            case GlobalParameterNameEnum.OXYGEN:
                this.maxStep = GlobalConstants.GLOBAL_PARAMETER_OXYGEN_MAXSTEP;
                break;

            case GlobalParameterNameEnum.TEMPERATURE:
                this.maxStep =  GlobalConstants.GLOBAL_PARAMETER_TEMPERATURE_MAXSTEP;
                break;

            case GlobalParameterNameEnum.OCEAN:
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
    public boolean isMaxedOut(){
        return this.step==this.maxStep;
    }

    public GlobalParameterDTO toJson(){
        return new GlobalParameterDTO(this);
    }
    public static GlobalParameter fromJson(GlobalParameterDTO dto) {
        return new GlobalParameter(dto);
    }

    public static List<GlobalParameter> createGameGlobalParameters(){
        List<GlobalParameter> parameters = new ArrayList<>();

        parameters.add(new GlobalParameter(GlobalParameterNameEnum.OCEAN));
        parameters.add(new GlobalParameter(GlobalParameterNameEnum.INFRASTRUCTURE));
        parameters.add(new GlobalParameter(GlobalParameterNameEnum.TEMPERATURE));
        parameters.add(new GlobalParameter(GlobalParameterNameEnum.OXYGEN));

        return parameters;
    }

    public static GlobalParameterData toData(GlobalParameter param){
        return new GlobalParameterData(param);
    }

    public static List<GlobalParameterData> toDataList(List<GlobalParameter> parameters){
        List<GlobalParameterData> dataList = new ArrayList<>();
        for(GlobalParameter parameter: parameters){
            dataList.add(GlobalParameter.toData(parameter));
        }
        return dataList;
    }
}
