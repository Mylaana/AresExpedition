package com.ares_expedition.enums.game;

public enum AwardsEnum {
    A_VISIONARY("BASE"), //most phase upgraded
    A_GENERATOR("BASE"), //most heat production
    A_PROJECT_MANAGER("BASE"), //most cards played
    A_COLLECTER("BASE"), //most ressources on cards
    A_CELEBRITY("BASE"), //most MC prod (without TR)
    A_INDUSTRIALIST("BASE"), //most steel + titanium
    A_RESEARCHER("BASE"), //most science tags

    A_CONTRACTOR("FANMADE"), //most building tags
    A_SPACEBARON("FANMADE"), //most space tags
    A_TRAVELLER("FANMADE"), //most earth + jovian
    A_BIOLOGIST("FANMADE"), //most bio tags
    A_ELECTRICIAN("FANMADE"), //most power tags
    A_SPENDTHRIFT("FANMADE"); //most card of 20+MC value

    private final String category;

    AwardsEnum(String category) {
        this.category = category;
    }

    public String getCategory(){
        return category;
    }
}
