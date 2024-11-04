package com.ares_expedition.stomp_websocket;

import com.ares_expedition.enums.websocket.ContentResultEnum;

public class PlayerMessageAnswer {
    ContentResultEnum contentType;
    Object content;

    public PlayerMessageAnswer(){
    }
    public PlayerMessageAnswer(ContentResultEnum contentType, Object content){
        this.content = content;
        this.contentType = contentType;
    }
    public ContentResultEnum getContentType(){
        return this.contentType;
    }
    public Object getContent(){
        return this.content;
    }
}
