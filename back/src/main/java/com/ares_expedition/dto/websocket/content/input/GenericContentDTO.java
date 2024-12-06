package com.ares_expedition.dto.websocket.content.input;

public class GenericContentDTO extends BaseContentDTO{
    Object content;

    public GenericContentDTO(){
    }

    public Object getContent(){
        return this.content;
    }

    public void setContent(Object content){
        this.content = content;
    }
}
