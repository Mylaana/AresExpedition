package com.ares_expedition.dto.websocket.messages.input;

import com.ares_expedition.dto.websocket.content.input.*;
import com.ares_expedition.dto.websocket.content.player_state.PlayerStateDTO;
import com.ares_expedition.enums.websocket.ContentQueryEnum;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

public class BaseMessageInputDTO<T>{
    protected String uuid;
    protected String gameId;
    protected String playerId;
    protected ContentQueryEnum contentEnum;

    @JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.EXTERNAL_PROPERTY, //Use external property to determine type
        property = "contentEnum" //the external property used to determine type
    )
    @JsonSubTypes({
    @JsonSubTypes.Type(value = PlayerStateDTO.class, name = "PLAYER_STATE_PUSH"),
    @JsonSubTypes.Type(value = PlayerReadyContentDTO.class, name = "READY_QUERY"),
    @JsonSubTypes.Type(value = PhaseSelectedContentDTO.class, name = "SELECTED_PHASE_QUERY"),
    @JsonSubTypes.Type(value = GenericContentDTO.class, name = "PLAYER_GAME_STATE_QUERY"),
    @JsonSubTypes.Type(value = DrawContentDTO.class, name = "DRAW_QUERY"),
    @JsonSubTypes.Type(value = GenericContentDTO.class, name = "DEBUG"),
    @JsonSubTypes.Type(value = GenericContentDTO.class, name = "PLAYER_CONNECT"),
    @JsonSubTypes.Type(value = OceanContentDTO.class, name = "OCEAN_QUERY"),
    @JsonSubTypes.Type(value = ScanKeepContentDTO.class, name = "SCAN_KEEP_QUERY"),
    @JsonSubTypes.Type(value = ScanKeepContentDTO.class, name = "RESEARCH_QUERY"),
    // Add other types here

    })
    protected T content;

    public BaseMessageInputDTO(){}
    public BaseMessageInputDTO(String uuid, String gameId, String clientId, ContentQueryEnum contentType, T content){
        this.uuid = uuid;
        this.gameId = gameId;
        this.playerId = clientId;
        this.contentEnum = contentType;
        this.content = content;
    }
    public String getUuid(){
        return this.uuid;
    }
    public String getGameId(){
        return this.gameId;
    }
    public String getPlayerId(){
        return this.playerId;
    }
    public ContentQueryEnum getContentEnum(){
        return this.contentEnum;
    }
    public T getContent(){
        return this.content;
    }
    public void setUuid(String uuid){
        this.uuid = uuid;
    }
    public void setGameId(String gameId){
        this.gameId = gameId;
    }
    public void setPlayerId(String clientId){
        this.playerId = clientId;
    }
    public void setContentEnum(ContentQueryEnum queryEnum){
        this.contentEnum = queryEnum;
    }
    public void setContent(T content){
        this.content = content;
    }
}
