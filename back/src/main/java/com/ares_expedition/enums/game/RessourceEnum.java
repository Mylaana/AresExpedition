package com.ares_expedition.enums.game;

public enum RessourceEnum {
    MEGACREDIT("megacredit"),
    CARD("card"),
    PLANT("plant"),
    UNDEFINED("undefined");


    public final String dto;

    private RessourceEnum(String dto){
        this.dto = dto;
    }
    
    public static RessourceEnum toEnum(String dto){
        for(RessourceEnum r: values()){
            if(r.dto==dto){
                return r;
            }
        }
        return UNDEFINED;
    }
    public String getDto() {
        return dto;
    }
}
