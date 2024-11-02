package com.ares_expedition.stomp_websocket;

import com.ares_expedition.enums.PlayerMessageQueryEnum;


public class PlayerMessageQuery {
    private Integer gameId;
    private Integer clientId;
    private PlayerMessageQueryEnum contentType;
    private Object content;

    PlayerMessageQuery(){}
    PlayerMessageQuery(Integer gameId, Integer clientId, PlayerMessageQueryEnum contentType, Object content){
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
    public PlayerMessageQueryEnum getContentType(){
        return this.contentType;
    }
    public Object getContent(){
        return this.content;
    }
}
