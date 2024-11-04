package com.ares_expedition.controller.game;

import java.util.ArrayList;
import java.util.List;

public class DeckController {
    public DeckController() {}
    public static List<Integer> drawCards(Integer drawNumber) {
        List<Integer> cardIdList = new ArrayList<Integer>();
        for(Integer i=0; i<drawNumber; i++){
            cardIdList.add(i);
        }
        return cardIdList;
    }

}
