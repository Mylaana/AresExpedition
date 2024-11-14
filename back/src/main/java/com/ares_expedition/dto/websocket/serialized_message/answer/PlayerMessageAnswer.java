package com.ares_expedition.dto.websocket.serialized_message.answer;

import com.ares_expedition.enums.websocket.ContentResultEnum;

public class PlayerMessageAnswer {
    ContentResultEnum contentEnum;
    Object content;

    public PlayerMessageAnswer(){
    }
    public PlayerMessageAnswer(String content){
        this.contentEnum = ContentResultEnum.DEBUG;
        this.content = content;
    }
    public PlayerMessageAnswer(ContentResultEnum contentType, Object content){
        this.content = content;
        this.contentEnum = contentType;
    }
    public ContentResultEnum getContentEnum(){
        return this.contentEnum;
    }
    public Object getContent(){
        return this.content;
    }
}
