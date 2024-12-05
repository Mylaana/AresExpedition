package com.ares_expedition.controller.websocket;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

import com.ares_expedition.dto.websocket.messages.input.BaseMessageDTO;

@Controller
public class WsControllerInput {
    private final InputRouter inputRouter;

    public WsControllerInput(InputRouter inputRouter) {
        this.inputRouter = inputRouter;
    }

    /*
    @MessageMapping("/player")
    public <T> void resolvePlayerQuery(PlayerMessageQuery<T> message) throws Exception {
        inputRouter.routeInput(message);
    }*/
    @MessageMapping("/player")
    public void resolvePlayerQuery(BaseMessageDTO<?> message) throws Exception {
        inputRouter.routeInput(message);
    }

    @MessageMapping("/debug")
    public <T> void resolveTest(BaseMessageDTO<T> message) throws Exception {
        inputRouter.routeDebug(message);
    }
}
