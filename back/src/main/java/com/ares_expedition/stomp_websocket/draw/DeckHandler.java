package com.ares_expedition.stomp_websocket.draw;

import java.util.ArrayList;
import java.util.List;

import com.ares_expedition.database.*;

public class DeckHandler {
    public DeckHandler() {}
    public static List<Integer> drawCards(Integer drawNumber) {
        List<Integer> cardIdList = new ArrayList<Integer>();
        for(Integer i=0; i<drawNumber; i++){
            cardIdList.add(i);
        }
        return cardIdList;
    }

}
