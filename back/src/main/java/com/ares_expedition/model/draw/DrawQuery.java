package com.ares_expedition.model.draw;

public class DrawQuery {
    Integer drawNumber;

    public DrawQuery(){
    }
    public DrawQuery(Integer drawNumber){
        this.drawNumber = drawNumber;
    }
  
    public Integer getDrawNumber() {
      return drawNumber;
    }
  
    public void setName(Integer drawNumber) {
      this.drawNumber = drawNumber;
    }
}
