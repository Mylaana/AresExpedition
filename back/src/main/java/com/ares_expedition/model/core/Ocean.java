package com.ares_expedition.model.core;

import java.util.HashMap;
import java.util.Map;

import com.ares_expedition.enums.game.RessourceEnum;

public class Ocean {
    Boolean flipped = false;
    Map<RessourceEnum, Integer> bonuses = new HashMap<>();

    Ocean(){
    }
    public Ocean(Integer initializeIndex){
        switch (initializeIndex) {
            case 0:
                this.bonuses.put(RessourceEnum.PLANT, 2);
                break;
            case 1:
                this.bonuses.put(RessourceEnum.MEGACREDIT, 4);
                break;
            case 2:
                this.bonuses.put(RessourceEnum.PLANT, 1);
                this.bonuses.put(RessourceEnum.MEGACREDIT, 2);
                break;
            case 3:
                this.bonuses.put(RessourceEnum.CARD, 1);
                this.bonuses.put(RessourceEnum.MEGACREDIT, 1);
                break;
            case 4:
                this.bonuses.put(RessourceEnum.CARD, 1);
                break;
            case 5:
                this.bonuses.put(RessourceEnum.CARD, 1);
                this.bonuses.put(RessourceEnum.PLANT, 1);
                break;
            case 6:
                this.bonuses.put(RessourceEnum.CARD, 1);
                break;
            case 7:
                this.bonuses.put(RessourceEnum.PLANT, 1);
                this.bonuses.put(RessourceEnum.MEGACREDIT, 1);
                break;
            case 8:
                this.bonuses.put(RessourceEnum.PLANT, 2);
                break;
            default:
                break;
        }
    }
    public Boolean getFlipped() {
        return flipped;
    }
    public void setFlipped(Boolean flipped) {
        this.flipped = flipped;
    }
    public Map<RessourceEnum, Integer> getBonuses() {
        return bonuses;
    }
    public void setBonuses(Map<RessourceEnum, Integer> bonuses) {
        this.bonuses = bonuses;
    }
}
