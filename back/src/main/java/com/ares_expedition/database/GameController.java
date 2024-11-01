package com.ares_expedition.database;

import java.util.ArrayList;
import java.util.List;

public class GameController {
    public static List<Integer> drawCards(Integer gameId, Integer drawNumber){
        Game game = JsonGameReader.getGame(gameId);
        List<Integer> deck = game.getDeck();
        ArrayList<Integer> result = new ArrayList<Integer>();

        for(Integer i=0; i<drawNumber; i++){
            int rand = (int)(Math.random()*deck.size());

            result.add(deck.get(rand));
            deck.remove(rand);
        }

        return result;
    }

}
