package com.ares_expedition.dto.api;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class NewGameInfoDTO {
    Map<String, Object> options;
    List<String> links = new ArrayList<>();

    NewGameInfoDTO(){
    }
    public NewGameInfoDTO(List<String> links){
        this.links = links;
    }
    public NewGameInfoDTO(List<String> links, Map<String, Object> options){
        this.links = links;
        this.options = options;
    }
    public List<String> getLinks() {
        return links;
    }
    public void setLinks(List<String> links) {
        this.links = links;
    }
    public Map<String, Object> getOptions() {
        return options;
    }
    public void setOptions(Map<String, Object> options) {
        this.options = options;
    }
    
}
