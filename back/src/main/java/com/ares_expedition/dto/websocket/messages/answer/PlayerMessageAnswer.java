package com.ares_expedition.dto.websocket.messages.answer;

import com.ares_expedition.enums.websocket.ContentResultEnum;

public class PlayerMessageAnswer {
    Integer gameId;
    ContentResultEnum contentEnum;
    Object content;

    public PlayerMessageAnswer(){
    }
    public PlayerMessageAnswer(Integer gameId, String content){
        this.gameId = gameId;
        this.contentEnum = ContentResultEnum.DEBUG;
        this.content = content;
    }
    public PlayerMessageAnswer(Integer gameId, ContentResultEnum contentType){
        this.gameId = gameId;
        this.content = null;
        this.contentEnum = contentType;
    }
    public PlayerMessageAnswer(Integer gameId, ContentResultEnum contentType, Object content){
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
    public Integer getGameId(){
        return this.gameId;
    }
}
