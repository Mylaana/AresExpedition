package com.ares_expedition.dto.websocket.serialized_message.query;

import com.ares_expedition.enums.websocket.ContentQueryEnum;


public class PlayerMessageQuery<T>{
    protected Integer gameId;
    protected Integer playerId;
    protected ContentQueryEnum contentEnum;
    protected T content;

    public PlayerMessageQuery(){}
    public PlayerMessageQuery(Integer gameId, Integer clientId, ContentQueryEnum contentType, T content){
        this.gameId = gameId;
        this.playerId = clientId;
        this.contentEnum = contentType;
        this.content = content;
    }
    public Integer getGameId(){
        return this.gameId;
    }
    public Integer getPlayerId(){
        return this.playerId;
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
    public void setPlayerId(Integer clientId){
        this.playerId = clientId;
    }
    public void setContentEnum(ContentQueryEnum queryEnum){
        this.contentEnum = queryEnum;
    }
    public void setContent(T content){
        this.content = content;
    }
}
