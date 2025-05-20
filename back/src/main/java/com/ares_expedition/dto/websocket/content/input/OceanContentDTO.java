package com.ares_expedition.dto.websocket.content.input;

import com.ares_expedition.dto.websocket.content.player_state.PlayerStateDTO;

public class OceanContentDTO extends BaseContentDTO{
	Integer oceanNumber;
	PlayerStateDTO playerState;

	public OceanContentDTO(){
	}

	public OceanContentDTO(Integer oceanNumber){
		this.oceanNumber = oceanNumber;
	}

	public Integer getOceanNumber() {
		return oceanNumber;
	}

	public void setOceanNumber(Integer oceanNumber) {
		this.oceanNumber = oceanNumber;
	}

	public PlayerStateDTO getPlayerState() {
		return playerState;
	}

	public void setPlayerState(PlayerStateDTO playerState) {
		this.playerState = playerState;
	}
}