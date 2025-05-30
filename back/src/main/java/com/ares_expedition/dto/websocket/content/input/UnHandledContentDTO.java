package com.ares_expedition.dto.websocket.content.input;

import java.util.Map;

public class UnHandledContentDTO extends BaseContentDTO {
    Object content;
    
    public UnHandledContentDTO(){
    }

    public UnHandledContentDTO(Object content){
        this.content = content;
    }

    public UnHandledContentDTO(Map<String, Object> content){
        this.content = content;
    }
    
    public Object getContent() {
        return content;
    }
    
    public void setContent(Object content) {
        this.content = content;
    }
}
