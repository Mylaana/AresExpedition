package com.ares_expedition.model.player_state.subclass;

import com.ares_expedition.dto.websocket.content.player_state.subclass.PlayerInfoStateDTO;

public class PlayerInfoState {
    private Integer id;
    private String name;
    private String color;

    public PlayerInfoState(){
    }
    PlayerInfoState(PlayerInfoStateDTO dto) {
        this.id = dto.getId();
        this.name = dto.getName();
        this.color = dto.getColor();
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

    public static PlayerInfoState fromJson(PlayerInfoStateDTO dto) {
        return new PlayerInfoState(dto);
    }
    
    public PlayerInfoStateDTO toJson() {
        return new PlayerInfoStateDTO(this);
    }
}
