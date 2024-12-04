package com.ares_expedition.model.query.player;

import java.util.Map;

import com.ares_expedition.model.query.BaseQuery;

public class GenericQuery extends BaseQuery{
    Object content;

    public GenericQuery(){
    }
    
    public GenericQuery(Map<String, Object> data) {
        this.content = data.get("debug");
    }

    public Object getContent(){
        return this.content;
    }

    public void setContent(Object content){
        this.content = content;
    }
}
