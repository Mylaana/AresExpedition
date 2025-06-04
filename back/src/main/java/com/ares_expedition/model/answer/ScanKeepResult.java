package com.ares_expedition.model.answer;
import java.util.*;

import com.ares_expedition.enums.game.ScanKeepOptionsEnum;

public class ScanKeepResult {
    List<Integer> cardIdList = new ArrayList<Integer>();
    Integer keep;
    Integer eventId;
    ScanKeepOptionsEnum options;

    public ScanKeepResult(){
    }

    public ScanKeepResult(List<Integer> cardIdList, Integer keep, Integer eventId, ScanKeepOptionsEnum options) {
        this.cardIdList = cardIdList;
        this.keep = keep;
        this.eventId = eventId;
        this.options = options;
    }

    public List<Integer> getCardIdList() {
        return cardIdList;
    }

    public void setCardIdList(List<Integer> cardIdList){
        this.cardIdList = cardIdList;
    }

    public Integer getEventId() {
        return this.eventId;
    }
    
    public void setEventId(Integer eventId) {
        this.eventId = eventId;
    }

    public Integer getKeep() {
        return keep;
    }

    public void setKeep(Integer keep) {
        this.keep = keep;
    }

    public ScanKeepOptionsEnum getOptions() {
        return options;
    }

    public void setOptions(ScanKeepOptionsEnum options) {
        this.options = options;
    }
}
