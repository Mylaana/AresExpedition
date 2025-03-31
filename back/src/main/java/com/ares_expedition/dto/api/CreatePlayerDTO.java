package com.ares_expedition.dto.api;

public class CreatePlayerDTO {
    String id;
    String name;
    String color;

    CreatePlayerDTO(){
    }
    public CreatePlayerDTO(String id, String name, String color){
        this.id = id;
        this.name = name;
        this.color = color;
    }
    public String getId() {
        return id;
    }
    public void setId(String id) {
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
