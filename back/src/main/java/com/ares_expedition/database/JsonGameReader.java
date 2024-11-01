    package com.ares_expedition.database;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

public class JsonGameReader {
    public static void main(String[] args) {
    }
    public static Game getGame(Integer gameId){
        ObjectMapper objectMapper = new ObjectMapper();
        
        try {
            InputStream inputStream = JsonGameReader.class.getClassLoader().getResourceAsStream("data/database.json");
            if (inputStream == null) {
                throw new FileNotFoundException("Le fichier game.json n'a pas été trouvé.");
            }
            return objectMapper.readValue(inputStream, Game.class);
        } catch (IOException e) {
            e.printStackTrace();
        }
        
        return new Game();
    }
}
