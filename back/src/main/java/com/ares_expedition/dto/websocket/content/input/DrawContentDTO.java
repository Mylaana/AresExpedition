package com.ares_expedition.dto.websocket.content.input;

import java.util.Map;

public class DrawContentDTO extends BaseContentDTO{
    Integer drawNumber;
    Integer eventId;

    public DrawContentDTO(){
    }

    public DrawContentDTO(Integer drawNumber, Integer eventId){
      this.drawNumber = drawNumber;
      this.eventId = eventId;
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