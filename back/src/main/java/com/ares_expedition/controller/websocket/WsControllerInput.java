package com.ares_expedition.controller.websocket;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

import com.ares_expedition.dto.websocket.serialized_message.query.PlayerMessageQuery;

@Controller
public class WsControllerInput {
    private final InputRouter inputRouter;

    public WsControllerInput(InputRouter inputRouter) {
        this.inputRouter = inputRouter;
    }

    @MessageMapping("/player")
    public <T> void resolvePlayerQuery(PlayerMessageQuery<T> message) throws Exception {
        inputRouter.routeInput(message);
    }
}
