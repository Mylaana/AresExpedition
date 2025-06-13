package com.ares_expedition.model.answer;
import java.util.*;

public class DrawResult {
    List<String> cardIdList = new ArrayList<String>();
    Integer eventId;

    public DrawResult(){
    }

    public DrawResult(List<String> cardIdList, Integer eventId) {
        this.cardIdList = cardIdList;
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
}
