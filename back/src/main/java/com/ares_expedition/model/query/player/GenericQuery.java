package com.ares_expedition.model.query.player;

import com.ares_expedition.model.query.BaseQuery;

public class GenericQuery extends BaseQuery{
    Object content;

    public GenericQuery(){
    }

    public Object getContent(){
        return this.content;
    }

    public void setContent(Object content){
        this.content = content;
    }
}
