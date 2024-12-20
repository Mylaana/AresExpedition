package com.ares_expedition.model.query.draw;

import java.util.Map;

import com.ares_expedition.model.query.BaseQuery;

public class DrawQuery extends BaseQuery{
    Integer drawNumber;
    Integer eventId;

    public DrawQuery(){
    }

    public DrawQuery(Integer drawNumber, Integer eventId){
      this.drawNumber = drawNumber;
      this.eventId = eventId;
    }
    
    public DrawQuery(Map<String, Object> data) {
      this.drawNumber = (Integer) data.get("draw");
      this.eventId = (Integer) data.get("eventId");
    }

    public Integer getDrawNumber() {
      return drawNumber;
    }
  
    public void setDrawNumber(Integer drawNumber) {
      this.drawNumber = drawNumber;
    }

    public Integer getEventId() {
      return this.eventId;
    }
  
    public void setEventId(Integer eventId) {
      this.eventId = eventId;
    }
}

interface PlayerMessageDrawQuery {
  public Integer draw();
}