package com.ares_expedition.enums.game;

public final class GlobalConstants {
    public static final Integer GLOBAL_PARAMETER_INFRASTRUCTURE_MAXSTEP = 15;
    public static final Integer GLOBAL_PARAMETER_OXYGEN_MAXSTEP = 15;
    public static final Integer GLOBAL_PARAMETER_TEMPERATURE_MAXSTEP = 20;
    public static final Integer GLOBAL_PARAMETER_OCEAN_MAXSTEP = 9;
    public static final Integer GLOBAL_PARAMETER_MOON_MAXSTEP = 17;

    public static final Integer STARTING_HAND_SIZE = 8;

    public static final Integer BACKEND_DATABASE_VERSION = 1;

    public static final int SCHEDULER_RUN_INTERVAL_HOURS = 3;
    public static final Integer SCHEDULER_DELETE_AFTER_HOURS_RUNNING_INACTIVE = 48;
    public static final Integer SCHEDULER_DELETE_AFTER_HOURS_NEW_GAME_INACTIVE = 2;
    public static final Integer SCHEDULER_DELETE_AFTER_HOURS_FINISHED = 1;
    public static final Integer SCHEDULER_DELETE_NEW_GAME_PROGRESSION_TRESHOLD = 10;
}
