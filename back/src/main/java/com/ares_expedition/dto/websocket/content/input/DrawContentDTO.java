package com.ares_expedition.dto.websocket.content.input;

import java.util.List;

import com.ares_expedition.dto.websocket.content.player_state.PlayerStateDTO;

public class DrawContentDTO extends BaseContentDTO{
    Integer drawNumber;
    Integer eventId;
    PlayerStateDTO playerState;
    Integer thenDiscard;
    Boolean isCardProductionDouble;
    List<String> firstCardProductionList;

    public DrawContentDTO(){
    }

    public DrawContentDTO(Integer drawNumber, Integer eventId, Boolean isProductionDouble, List<String> firstCardProductionList){
      this.drawNumber = drawNumber;
      this.eventId = eventId;
      this.isCardProductionDouble = isProductionDouble;
      this.firstCardProductionList = firstCardProductionList;
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

    public Boolean getIsCardProductionDouble() {
      return isCardProductionDouble;
    }

    public void setIsCardProductionDouble(Boolean isProductionDouble) {
      this.isCardProductionDouble = isProductionDouble;
    }

    public List<String> getFirstCardProductionList() {
      return firstCardProductionList;
    }

    public void setFirstCardProductionList(List<String> firstCardProductionList) {
      this.firstCardProductionList = firstCardProductionList;
    }
}

interface PlayerMessageDrawQuery {
  public Integer draw();
}