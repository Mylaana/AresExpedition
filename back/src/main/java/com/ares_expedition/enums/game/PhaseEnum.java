package com.ares_expedition.enums.game;

public enum PhaseEnum {
    PLANIFICATION(0),
    DEVELOPMENT(1),
    CONSTRUCTION(2),
    ACTION(3),
    PRODUCTION(4),
    RESEARCH(5);

    private final int priority;

    PhaseEnum(int priority) {
        this.priority = priority;
    }

    public int getPriority() {
        return priority;
    }
}
