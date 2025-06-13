package com.ares_expedition.model.answer;
import java.util.*;

public class ResearchResult {
    List<String> cardIdList = new ArrayList<String>();
    Integer keep;
    Integer eventId;

    public ResearchResult(){
    }

    public ResearchResult(List<String> cardIdList, Integer keep, Integer eventId) {
        this.cardIdList = cardIdList;
        this.keep = keep;
        this.eventId = eventId;
    }

    public List<String> getCardIdList() {
        return cardIdList;
    }

    public void setCardIdList(List<String> cardIdList){
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
}
