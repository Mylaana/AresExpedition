package com.ares_expedition.controller.system;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.ares_expedition.controller.game.GameController;

@Service
public class Scheduler {

    @Autowired
    private GameController gameController;

    @Scheduled(fixedRate =  12 * 60 * 60 * 1000)
    public void runCleanup() {
        gameController.cleanupOldGames();
    }
}
