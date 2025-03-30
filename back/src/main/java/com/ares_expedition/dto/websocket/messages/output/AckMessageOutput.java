package com.ares_expedition.dto.websocket.messages.output;

import com.ares_expedition.enums.websocket.ContentResultEnum;

public class AckMessageOutput {
    String gameId;
    ContentResultEnum contentEnum;
    String uuid;

    public AckMessageOutput(){
    }
    public AckMessageOutput(String gameId, String uuid){
        this.gameId = gameId;
        this.contentEnum = ContentResultEnum.ACKNOWLEDGE;
        this.uuid = uuid;
    }
    public ContentResultEnum getContentEnum(){
        return this.contentEnum;
    }
    public Object getUuid(){
        return this.uuid;
    }
    public String getGameId(){
        return this.gameId;
    }
}