package com.ares_expedition.stomp_websocket;



public class PlayerMessageAnswer {
    Object content;

    public PlayerMessageAnswer(){
    }
    public PlayerMessageAnswer( Object content) {
        this.content = content;
    }
    public Object getContent() {
        return this.content;
    }
}
