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
        /*
         
        this.expansionDiscovery = (boolean) gameOptions.get("discovery");
        this.expansionFoundations = (boolean) gameOptions.get("foundations");
        this.expansionPromo = (boolean) gameOptions.get("promo");
        this.expansionFanmade = (boolean) gameOptions.get("fanmade");
        this.expansionBalanced = (boolean) gameOptions.get("balanced");
        
        this.modeInitialDraft = (boolean) gameOptions.get("initialDraft");
        this.modeInfrastructureMandatory = (boolean) gameOptions.get("infrastructureMandatory");
        this.modeMerger = (boolean) gameOptions.get("merger");
        this.modeStandardUpgrade = (boolean) gameOptions.get("standardUpgrade");
        this.modeDeadHand = (boolean) gameOptions.get("deadHand");
        modeAdditionalAwardsFromJson(gameOptions);
        */
    }
    public Boolean isContentActive(GameContentNameEnum name){
        return true;
    }

    public Map<GameContentNameEnum, GameOption> getOptions() {
        return options;
    }

    public void setOptions(Map<GameContentNameEnum, GameOption> options){
        this.options = options;
    }
    /*
     
    public Boolean getModeMerger() {
        return modeMerger;
    }
    
    public void setModeMerger(Boolean merger) {
        this.modeMerger = merger;
    }
    
    public Boolean getExpansionDiscovery() {
        return expansionDiscovery;
    }
    
    public void setExpansionDiscovery(Boolean expansionDiscovery) {
        this.expansionDiscovery = expansionDiscovery;
    }
    
    public Boolean getExpansionFoundations() {
        return expansionFoundations;
    }
    
    public void setExpansionFoundations(Boolean expansionFoundations) {
        this.expansionFoundations = expansionFoundations;
    }
    
    public Boolean getExpansionPromo() {
        return expansionPromo;
    }
    
    public void setExpansionPromo(Boolean expansionPromo) {
        this.expansionPromo = expansionPromo;
    }
    
    public Boolean getExpansionFanmade() {
        return expansionFanmade;
    }

    public void setExpansionFanmade(Boolean expansionFanmade) {
        this.expansionFanmade = expansionFanmade;
    }
    
    public Boolean getExpansionBalanced() {
        return expansionBalanced;
    }
    
    public void setExpansionBalanced(Boolean expansionBalanced) {
        this.expansionBalanced = expansionBalanced;
    }
    
    public Boolean getModeInitialDraft() {
        return modeInitialDraft;
    }
    
    public void setModeInitialDraft(Boolean modeInitialDraft) {
        this.modeInitialDraft = modeInitialDraft;
    }
    
    public Boolean getModeInfrastructureMandatory() {
        return modeInfrastructureMandatory;
    }
    
    public void setModeInfrastructureMandatory(Boolean modeInfrastructureMandatory) {
        this.modeInfrastructureMandatory = modeInfrastructureMandatory;
    }
    
    public Boolean getModeStandardUpgrade() {
        return modeStandardUpgrade;
    }
    
    public void setModeStandardUpgrade(Boolean modeStandardUpgrade) {
        this.modeStandardUpgrade = modeStandardUpgrade;
    }
    
    public Boolean getModeDeadHand() {
        return modeDeadHand;
    }
    
    public void setModeDeadHand(Boolean modeDeadHand) {
        this.modeDeadHand = modeDeadHand;
    }
    
    public Boolean getModeAdditionalAwards() {
        return modeAdditionalAwards;
    }
    
    public void modeAdditionalAwardsFromJson(Map<String, Object> gameOptions) {
        Object result = gameOptions.get("additionalAwards");
        if(result == null){
            this.modeAdditionalAwards = false;
            return;
        }
        this.modeAdditionalAwards = (boolean) result;
    }
    public void setModeAdditionalAwards(Boolean modeAdditionalAwards) {
        this.modeAdditionalAwards = modeAdditionalAwards;
    }
    */
}
