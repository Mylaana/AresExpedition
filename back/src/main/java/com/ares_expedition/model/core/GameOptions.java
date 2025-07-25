package com.ares_expedition.model.core;

import java.util.Map;

public class GameOptions {
    Boolean expansionDiscovery;
    Boolean expansionFoundations;
    Boolean expansionPromo;
    Boolean expansionFanMade;
    Boolean expansionBalanced;

    Boolean modeInitialDraft;
    Boolean modeInfrastructureMandatory;
    Boolean modeMerger;

    GameOptions(){
    }
    
    public GameOptions(Map<String, Object> gameOptions){
        this.expansionDiscovery = (boolean) gameOptions.get("discovery");
        this.expansionFoundations = (boolean) gameOptions.get("foundations");
        this.expansionPromo = (boolean) gameOptions.get("promo");
        this.expansionFanMade = (boolean) gameOptions.get("fanmade");
        this.expansionBalanced = (boolean) gameOptions.get("balanced");

        this.modeInitialDraft = (boolean) gameOptions.get("initialDraft");
        this.modeInfrastructureMandatory = (boolean) gameOptions.get("infrastructureMandatory");
        this.modeMerger = (boolean) gameOptions.get("merger");
    }

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

    public Boolean getExpansionFanMade() {
        return expansionFanMade;
    }

    public void setExpansionFanMade(Boolean expansionFanMade) {
        this.expansionFanMade = expansionFanMade;
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

    
}
