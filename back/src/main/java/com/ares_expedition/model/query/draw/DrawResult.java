package com.ares_expedition.model.query.draw;
import java.util.*;

public class DrawResult {
    List<Integer> cardIdList = new ArrayList<Integer>();
    Integer eventId;

    public DrawResult(){
    }

    public DrawResult(List<Integer> cardIdList, Integer eventId) {
        this.cardIdList = cardIdList;
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
}
