package com.ares_expedition.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaFallbackController {

    @RequestMapping(value = {
        "/game/**",
        "/new-game-link*",
        "/card-overview",
        "/create-game"
    })
    public String redirect() {
        return "forward:/index.html";
    }
}