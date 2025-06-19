package com.ares_expedition.dto.websocket.content.input;

import com.ares_expedition.dto.websocket.content.player_state.PlayerStateDTO;

public class DrawContentDTO extends BaseContentDTO{
    Integer drawNumber;
    Integer eventId;
    PlayerStateDTO playerState;
    Integer thenDiscard;

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

    public PlayerStateDTO getPlayerState() {
      return playerState;
    }

    public void setPlayerState(PlayerStateDTO playerState) {
      this.playerState = playerState;
    }

    public Integer getThenDiscard() {
      return thenDiscard;
    }

    public void setThenDiscard(Integer thenDiscard) {
      this.thenDiscard = thenDiscard;
    }
}

interface PlayerMessageDrawQuery {
  public Integer draw();
}