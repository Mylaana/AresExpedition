package com.ares_expedition.repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Collections;

public class Game {
    private Integer gameId;
    private List<Integer> deck;
    private List<Integer> discard;
    private List<Integer> groupPlayerId;

    public Game() {
    }

    public Game(Integer gameId, List<Integer> deck, List<Integer> discard, List<Integer> groupPlayerId) {
        this.gameId = gameId;
        this.deck = deck;
        this.discard = discard;
        this.groupPlayerId = groupPlayerId;
    }

    public Integer getGameId() {
        return this.gameId;
    }

    public void setGameId(Integer gameId) {
        this.gameId = gameId;
    }

    public List<Integer> getDeck() {
        return this.deck;
    }

    public void setDeck(List<Integer> deck) {
        this.deck = deck;
    }

    public List<Integer> getDiscard() {
        return this.discard;
    }

    public void setDiscard(List<Integer> discard) {
        this.discard = discard;
    }
    
    public List<Integer> getGroupPlayerId(){
        return this.groupPlayerId;
    }
    
    public void setGroupPlayerId(List<Integer> groupPlayerId){
        this.groupPlayerId = groupPlayerId;
    }

    public List<Integer> drawCards(Integer drawNumber){
        ArrayList<Integer> result = new ArrayList<Integer>();

        checkDeckSize(drawNumber);        
        Integer cardsToDraw = Math.min(drawNumber,this.deck.size());

        for(Integer i=0; i<cardsToDraw; i++){
            result.add(this.deck.get(0));
            this.deck.remove(0);
        }

        return result;
    }

    private void checkDeckSize(Integer drawNumber){
        if(drawNumber<=this.deck.size()){return;}
        addDiscardToDeck();
        
    }
    private void addDiscardToDeck(){
        Collections.shuffle(this.discard);
        this.deck.addAll(this.discard);
        this.discard.clear();
    }

    public void shuffleDeck(){
        Collections.shuffle(this.deck);
    }
    @Override
    public String toString() {
        return "Game{gameId=" + gameId + ", deck=" + deck + "}";
    }
}
