package com.ares_expedition.dto.websocket.messages.input;

import com.ares_expedition.dto.websocket.content.input.ScanKeepContentDTO;
import com.ares_expedition.enums.websocket.ContentQueryEnum;

public class ScanKeepMessageDTO extends BaseMessageInputDTO<ScanKeepContentDTO> {
    protected ScanKeepContentDTO content;

    public ScanKeepMessageDTO(){};

    public ScanKeepMessageDTO(String gameId, String clientId, ContentQueryEnum contentType, ScanKeepContentDTO content){
        this.gameId = gameId;
        this.playerId = clientId;
        this.contentEnum = contentType;
        this.content = content;
    }

    public ScanKeepContentDTO getContent(){
        return this.content;
    }

    public void setContent(ScanKeepContentDTO content){
        this.content = content;
    }

    public Integer getScan(){
        return this.content.getScan();
    }

    public Integer getKeep(){
        return this.content.getKeep();
    }

    public Integer getEventId(){
        return content.getEventId();
    }
}
