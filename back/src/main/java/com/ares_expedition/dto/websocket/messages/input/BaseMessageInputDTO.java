package com.ares_expedition.dto.websocket.messages.input;

import com.ares_expedition.dto.websocket.content.input.*;
import com.ares_expedition.enums.websocket.ContentQueryEnum;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

public class BaseMessageInputDTO<T>{
    protected Integer gameId;
    protected Integer playerId;
    protected ContentQueryEnum contentEnum;

    @JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.EXTERNAL_PROPERTY, // Utiliser une propriété externe pour le type
        property = "contentEnum" // Propriété externe utilisée pour déterminer le type
    )
    @JsonSubTypes({
    @JsonSubTypes.Type(value = PlayerStateContentDTO.class, name = "PLAYER_STATE_PUSH"),
    @JsonSubTypes.Type(value = PlayerReadyContentDTO.class, name = "READY_QUERY"),
    @JsonSubTypes.Type(value = PhaseSelectedContentDTO.class, name = "SELECTED_PHASE_QUERY"),
    @JsonSubTypes.Type(value = GenericContentDTO.class, name = "PLAYER_GAME_STATE_QUERY"),
    @JsonSubTypes.Type(value = GenericContentDTO.class, name = "DEBUG"),
        // Ajoute d'autres types ici en fonction de ContentQueryEnum
    })
    protected T content;

    public BaseMessageInputDTO(){}
    public BaseMessageInputDTO(Integer gameId, Integer clientId, ContentQueryEnum contentType, T content){
        this.gameId = gameId;
        this.playerId = clientId;
        this.contentEnum = contentType;
        this.content = content;
    }
    public Integer getGameId(){
        return this.gameId;
    }
    public Integer getPlayerId(){
        return this.playerId;
    }
    public ContentQueryEnum getContentEnum(){
        return this.contentEnum;
    }
    public T getContent(){
        return this.content;
    }
    public void setGameId(Integer gameId){
        this.gameId = gameId;
    }
    public void setPlayerId(Integer clientId){
        this.playerId = clientId;
    }
    public void setContentEnum(ContentQueryEnum queryEnum){
        this.contentEnum = queryEnum;
    }
    public void setContent(T content){
        this.content = content;
    }
}
