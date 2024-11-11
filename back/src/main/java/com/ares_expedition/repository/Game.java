package com.ares_expedition.repository;

import java.util.List;

public class Game {
    private Integer gameId;
    private List<Integer> deck;

    public Game() {
    }

    public Game(Integer gameId, List<Integer> deck) {
        this.gameId = gameId;
        this.deck = deck;
    }

    public Integer getGameId() {
        return this.gameId;
    }

    public void setGameId(Integer gameId) {  // Setter pour gameId
        this.gameId = gameId;
    }

    public List<Integer> getDeck() {
        return this.deck;
    }

    public void setDeck(List<Integer> deck) {  // Setter pour deck
        this.deck = deck;
    }

    @Override
    public String toString() {
        return "Game{gameId=" + gameId + ", deck=" + deck + "}";
    }
}
