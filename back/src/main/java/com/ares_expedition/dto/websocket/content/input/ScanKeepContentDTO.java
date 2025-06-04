package com.ares_expedition.dto.websocket.content.input;

import com.ares_expedition.dto.websocket.content.player_state.PlayerStateDTO;
import com.ares_expedition.enums.game.ScanKeepOptionsEnum;

public class ScanKeepContentDTO extends BaseContentDTO{
    Integer scan;
    Integer keep;
    Integer eventId;
    ScanKeepOptionsEnum options;
    PlayerStateDTO playerState;

    public ScanKeepContentDTO(){
    }

    public ScanKeepContentDTO(Integer scan, Integer keep, Integer eventId, ScanKeepOptionsEnum options){
      this.scan = scan;
      this.keep = keep;
      this.options = options;
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

    public ScanKeepOptionsEnum getOptions() {
      return options;
    }

    public void setOptions(ScanKeepOptionsEnum options) {
      this.options = options;
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