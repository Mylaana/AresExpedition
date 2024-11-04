package com.ares_expedition.controller.websocket;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

import com.ares_expedition.dto.websocket.*;

@Controller
public class WsControllerInput {
    private final InputRouter inputRouter;

    public WsControllerInput(InputRouter inputRouter) {
        this.inputRouter = inputRouter;
    }

    @MessageMapping("/player")
    public void resolvePlayerQuery(PlayerMessageQuery message) throws Exception {
        inputRouter.routeInput(message);
    }
}
