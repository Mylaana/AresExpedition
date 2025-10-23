package com.ares_expedition.controller.system;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.ares_expedition.controller.game.GameController;
import com.ares_expedition.enums.game.GlobalConstants;

@Service
public class Scheduler {
    @Autowired
    private GameController gameController;

    @Scheduled(fixedRate = GlobalConstants.SCHEDULER_RUN_INTERVAL_HOURS * 60 * 60 * 1000)
    public void runCleanup() {
        gameController.cleanupOldGames();
    }
}
