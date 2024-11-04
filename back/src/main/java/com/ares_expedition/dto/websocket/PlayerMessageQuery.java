package com.ares_expedition.dto.websocket;

import com.ares_expedition.enums.websocket.ContentQueryEnum;


public class PlayerMessageQuery {
    private Integer gameId;
    private Integer clientId;
    private ContentQueryEnum contentType;
    private Object content;

    PlayerMessageQuery(){}
    PlayerMessageQuery(Integer gameId, Integer clientId, ContentQueryEnum contentType, Object content){
        this.gameId = gameId;
        this.clientId = clientId;
        this.contentType = contentType;
        this.content = content;
    }
    public Integer getGameId(){
        return this.gameId;
    }
    public Integer getClientId(){
        return this.clientId;
    }
    public ContentQueryEnum getContentEnum(){
        return this.contentType;
    }
    public Object getContent(){
        return this.content;
    }
}
