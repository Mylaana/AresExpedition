package com.ares_expedition.model.core.subModel;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

@JsonInclude(Include.NON_NULL)
public class GameOption {
    private Integer quantity;
    private Boolean active;

    GameOption(){
    }
    GameOption(Boolean active){
        this.active = active;
    }
    GameOption(Boolean active, Integer quantity){
        this.active = active;
        this.quantity = quantity;
    }
    public Integer getQuantity() {
        return quantity;
    }
    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
    public Boolean getActive() {
        return active;
    }
    public void setActive(Boolean active) {
        this.active = active;
    }
}
