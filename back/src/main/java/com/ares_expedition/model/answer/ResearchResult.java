package com.ares_expedition.model.answer;
import java.util.*;

public class ResearchResult {
    List<Integer> cardIdList = new ArrayList<Integer>();
    Integer keep;
    Integer eventId;

    public ResearchResult(){
    }

    public ResearchResult(List<Integer> cardIdList, Integer keep, Integer eventId) {
        this.cardIdList = cardIdList;
        this.keep = keep;
        this.eventId = eventId;
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
}
