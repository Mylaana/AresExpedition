package com.ares_expedition.dto.websocket.content.input;

import com.ares_expedition.dto.websocket.content.player_state.PlayerStateDTO;

public class ScanKeepContentDTO extends BaseContentDTO{
    Integer scan;
    Integer keep;
    Integer eventId;
    PlayerStateDTO playerState;

    public ScanKeepContentDTO(){
    }

    public ScanKeepContentDTO(Integer scan, Integer keep, Integer eventId){
      this.scan = scan;
      this.keep = keep;
      this.eventId = eventId;
    }

    public Integer getScan() {
      return scan;
    }

    public void setScan(Integer scan) {
      this.scan = scan;
    }

    public Integer getKeep() {
      return keep;
    }

    public void setKeep(Integer keep) {
      this.keep = keep;
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
}