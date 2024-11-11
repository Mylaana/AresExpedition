package com.ares_expedition.dto.websocket;

import com.ares_expedition.enums.websocket.ContentQueryEnum;


public class PlayerMessageQuery<T>{
    protected Integer gameId;
    protected Integer clientId;
    protected ContentQueryEnum contentEnum;
    protected T content;

    public PlayerMessageQuery(){}
    public PlayerMessageQuery(Integer gameId, Integer clientId, ContentQueryEnum contentType, T content){
        this.gameId = gameId;
        this.clientId = clientId;
        this.contentEnum = contentType;
        this.content = content;
    }
    public Integer getGameId(){
        return this.gameId;
    }
    public Integer getClientId(){
        return this.clientId;
    }
    public ContentQueryEnum getContentEnum(){
        return this.contentEnum;
    }
    public T getContent(){
        return this.content;
    }
    public void setGameId(Integer gameId){
        this.gameId = gameId;
    }
    public void setClientId(Integer clientId){
        this.clientId = clientId;
    }
    public void setContentEnum(ContentQueryEnum queryEnum){
        this.contentEnum = queryEnum;
    }
    public void setContent(T content){
        this.content = content;
    }
}
