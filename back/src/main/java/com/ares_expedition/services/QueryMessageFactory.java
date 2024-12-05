package com.ares_expedition.services;

import java.lang.reflect.Constructor;

import com.ares_expedition.dto.websocket.content.BaseContentDTO;
import com.ares_expedition.dto.websocket.messages.input.BaseMessageDTO;
import com.ares_expedition.enums.websocket.ContentQueryEnum;
import com.fasterxml.jackson.databind.ObjectMapper;

public class QueryMessageFactory {
    public static <C extends BaseContentDTO, M extends BaseMessageDTO<C>> M createMessageQuery(
            BaseMessageDTO<?> baseMessage,
            Class<C> contentType,
            Class<M> messageQueryType) {

        C content = (C) toQueryType(baseMessage.getContent(), contentType);
        try {
            Constructor<M> constructor = messageQueryType.getConstructor(
                    Integer.class, Integer.class, ContentQueryEnum.class, contentType);
            return constructor.newInstance(
                    baseMessage.getGameId(),
                    baseMessage.getPlayerId(),
                    baseMessage.getContentEnum(),
                    content);
        } catch (Exception e) {
            throw new RuntimeException("Error creating message query instance", e);
        }
    }
    private static <C extends BaseContentDTO> C toQueryType(Object content, Class<C> contentType) {
        ObjectMapper mapper = new ObjectMapper();

        // Utiliser Jackson pour convertir directement le contenu
        return mapper.convertValue(content, contentType);
}
    /*
    private static <C extends BaseQuery> C toQueryType(Object content, Class<C> contentType) {
        if (!(content instanceof Map<?, ?>)) {
            throw new IllegalArgumentException("Invalid content format");
        }

        // Logique pour mapper le contenu (supposant un constructeur qui accepte un Map)
        Map<?, ?> contentMap = (Map<?, ?>) content;
        try {
            Constructor<C> constructor = contentType.getConstructor(Map.class);
            return constructor.newInstance(contentMap);
        } catch (Exception e) {
            throw new RuntimeException("Error mapping content, constructor(Map<String,Object>) missing or not working", e);
        }
    }
        */
}