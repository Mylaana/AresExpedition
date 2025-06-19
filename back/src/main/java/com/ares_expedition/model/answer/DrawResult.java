package com.ares_expedition.model.answer;
import java.util.*;

public class DrawResult {
    List<String> cardIdList = new ArrayList<String>();
    Integer eventId;
    Integer thenDiscard;

    public DrawResult(){
    }

    public DrawResult(List<String> cardIdList, Integer eventId, Integer thenDiscard) {
        this.cardIdList = cardIdList;
        this.eventId = eventId;
        this.thenDiscard = thenDiscard;
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

    public Integer getThenDiscard() {
        return thenDiscard;
    }

    public void setThenDiscard(Integer thenDiscard) {
        this.thenDiscard = thenDiscard;
    }

    
}
