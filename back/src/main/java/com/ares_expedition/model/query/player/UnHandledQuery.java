package com.ares_expedition.model.query.player;

import java.util.Map;

import com.ares_expedition.model.query.BaseQuery;

public class UnHandledQuery extends BaseQuery {
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
