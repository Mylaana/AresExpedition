package com.ares_expedition.model.draw;

import java.util.Map;

public class DrawQuery {
    Integer drawNumber;

    public DrawQuery(){
    }

    public DrawQuery(Integer drawNumber){
        this.drawNumber = drawNumber;
    }
   
    /*
    public <K,V> DrawQuery(Map<K, V> drawNumber){
      this.drawNumber = drawNumber.get("");
    }
      */

    public Integer getDrawNumber() {
      return drawNumber;
    }
  
    public void setDrawNumber(Integer drawNumber) {
      this.drawNumber = drawNumber;
    }
}

interface PlayerMessageDrawQuery {
  public Integer draw();
}