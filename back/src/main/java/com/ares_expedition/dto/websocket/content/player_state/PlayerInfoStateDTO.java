package com.ares_expedition.dto.websocket.content.player_state;

import com.ares_expedition.model.player_state.PlayerInfoState;

public class PlayerInfoStateDTO {
    private Integer id;
    private String name;
    private String color;

    PlayerInfoStateDTO(){
    }

    public PlayerInfoStateDTO(PlayerInfoState state){
        this.id = state.getId();
        this.name = state.getName();
        this.color = state.getColor();
    }

    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getColor() {
        return color;
    }
    public void setColor(String color) {
        this.color = color;
    }

    
}
