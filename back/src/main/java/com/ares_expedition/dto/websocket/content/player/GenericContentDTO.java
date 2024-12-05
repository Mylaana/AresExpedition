package com.ares_expedition.dto.websocket.content.player;

import com.ares_expedition.dto.websocket.content.BaseContentDTO;

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
