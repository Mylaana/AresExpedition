package com.ares_expedition.stomp_websocket.draw;
import java.util.*;

public class DrawResult {
    List<Integer> cardIdList = new ArrayList<Integer>();

    public DrawResult(){
    }
    public DrawResult(List<Integer> cardIdList) {
        this.cardIdList = cardIdList;
    }
    public List<Integer> getCardIdList() {
        return cardIdList;
    }
}