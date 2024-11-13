package com.ares_expedition.model.query.draw;

import java.util.Map;

import com.ares_expedition.model.query.GenericQuery;

public class DrawQuery extends GenericQuery{
    Integer drawNumber;

    public DrawQuery(){
    }

    public DrawQuery(Integer drawNumber){
        this.drawNumber = drawNumber;
    }
    
    public DrawQuery(Map<String, Object> data) {
        this.drawNumber = (Integer) data.get("draw");
  }

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