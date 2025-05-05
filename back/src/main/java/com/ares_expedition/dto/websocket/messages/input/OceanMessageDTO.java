package com.ares_expedition.dto.websocket.messages.input;

import com.ares_expedition.dto.websocket.content.input.OceanContentDTO;
import com.ares_expedition.enums.websocket.ContentQueryEnum;

public class OceanMessageDTO extends BaseMessageInputDTO<OceanContentDTO> {
    protected OceanContentDTO content;

    public OceanMessageDTO(){};

    public OceanMessageDTO(String gameId, String clientId, ContentQueryEnum contentType, OceanContentDTO content){
        this.gameId = gameId;
        this.playerId = clientId;
        this.contentEnum = contentType;
        this.content = content;
    }

    public OceanContentDTO getContent() {
        return content;
    }

    public void setContent(OceanContentDTO content) {
        this.content = content;
    }

    public Integer getOceanNumber() {
        return this.content.getOceanNumber();
    }

}
