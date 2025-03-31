package com.ares_expedition.dto.websocket.messages.output;

import com.ares_expedition.enums.websocket.ContentResultEnum;

public class BaseMessageOutputDTO {
    String gameId;
    ContentResultEnum contentEnum;
    Object content;

    public BaseMessageOutputDTO(){
    }
    public BaseMessageOutputDTO(String gameId, String content){
        this.gameId = gameId;
        this.contentEnum = ContentResultEnum.DEBUG;
        this.content = content;
    }
    public BaseMessageOutputDTO(String gameId, ContentResultEnum contentType){
        this.gameId = gameId;
        this.content = null;
        this.contentEnum = contentType;
    }
    public BaseMessageOutputDTO(String gameId, ContentResultEnum contentType, Object content){
        this.gameId = gameId;
        this.content = content;
        this.contentEnum = contentType;
    }
    public ContentResultEnum getContentEnum(){
        return this.contentEnum;
    }
    public Object getContent(){
        return this.content;
    }
    public String getGameId(){
        return this.gameId;
    }
}
