package com.ares_expedition.controller.system;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.ares_expedition.controller.game.GameController;

@Service
public class Scheduler {
    private static final Logger logger = LoggerFactory.getLogger(Scheduler.class);

    @Autowired
    private GameController gameController;

    @Scheduled(fixedRate =  60 * 60 * 1000)
    public void runCleanup() {
        gameController.cleanupOldGames();
    }
}
