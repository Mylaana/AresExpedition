package com.ares_expedition.model.query.player;

import java.util.Map;

import com.ares_expedition.model.query.GenericQuery;

public class UnHandledQuery extends GenericQuery {
    Object content;
    
    public UnHandledQuery(){
    }

    public UnHandledQuery(Object content){
        this.content = content;
    }

    public UnHandledQuery(Map<String, Object> content){
        this.content = content;
    }
    
    public Object getContent() {
        return content;
    }
    
    public void setContent(Object content) {
        this.content = content;
    }
}
