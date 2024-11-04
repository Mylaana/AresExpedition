package com.ares_expedition.stomp_websocket;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

import com.ares_expedition.enums.websocket.ContentResultEnum;

@Controller
public class WsControllerInput {
    private final WsControllerOutput wsControllerOutput;

    public WsControllerInput(WsControllerOutput wsControllerOutput) {
        this.wsControllerOutput = wsControllerOutput;
    }

    @MessageMapping("/player")
    public void resolvePlayerQuery(PlayerMessageQuery message) throws Exception {
        wsControllerOutput.sendPushToPlayer(1, 0, new PlayerMessageAnswer(ContentResultEnum.DRAW_RESULT ,"answer "+ message.getContentEnum()));
    }
}
