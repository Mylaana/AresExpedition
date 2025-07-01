    package com.ares_expedition.repository;

import com.ares_expedition.enums.game.CardTypeEnum;
import com.ares_expedition.model.core.Game;
import com.ares_expedition.repository.core.GameData;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.Reader;
import java.io.Writer;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class JsonGameDataHandler {
    private static final String DATABASE_NAME = "database.json";
    private static final String DATABASE_DIRECTORY = "data/";
    private static final String DATABASE_PATH = DATABASE_DIRECTORY + DATABASE_NAME;
    private static final String CARDS_DATA_PATH = "data/cards_data.json";
    private static final ObjectMapper objectMapper = new ObjectMapper();

    public static Game getGame(String gameId){
        checkDatabaseExistOrCreateIt();
        System.out.println("\u001B[31m GET GAME: " +gameId +" \u001B[0m");
        Map<String, Game> games = readGames();
        return games.getOrDefault(gameId, new Game());
    }

    public static Map<String, Game> getAllGames() {
        checkDatabaseExistOrCreateIt();
        System.out.println("\u001B[31m GET ALL GAMES \u001B[0m");
        Map<String, Game> games = readGames();
        System.out.println("games loaded");
        return games;
    }

    public static void saveGame(Game saveGame) {
        checkDatabaseExistOrCreateIt();
        System.out.println("\u001B[31m SAVE GAME \u001B[0m");

        Map<String, Game> games = readGames();
        Map<String, GameData> gamesDTO = Game.toDataMap(games);
        gamesDTO.put(saveGame.getGameId(), saveGame.toData());
        writeGames(gamesDTO);
    }

    private static Map<String, Game> readGames(){
        File file = Paths.get(DATABASE_PATH).toFile();
        //System.out.println("\u001B[32m \u001B[0m");
        if(!file.exists()){
            System.err.println("\\u001B[32m File not found: " + new File(DATABASE_PATH).getAbsolutePath());
            return new HashMap<>();
        }

        try (Reader reader = new FileReader(file)){
            long length = file.length();
            if (length == 0) {
                System.err.println("Empty database.json file.");
                return new HashMap<>();
            }
            return objectMapper.readValue(reader, new TypeReference<Map<String, Game>>(){});
        } catch (IOException error) {
            error.printStackTrace();
            return new HashMap<>();
        }

    }

    private static void writeGames(Map<String, GameData> games){
        try (Writer writer = new FileWriter(Paths.get(DATABASE_PATH).toFile())) {
            objectMapper.enable(SerializationFeature.INDENT_OUTPUT);
            objectMapper.writerWithDefaultPrettyPrinter().writeValue(writer, games);
        } catch (IOException error) {
            error.printStackTrace();
        }
    }

    public static List<String> getCardsIdList(CardTypeEnum type){
        File file = Paths.get(CARDS_DATA_PATH).toFile();
        List<String> idList = new ArrayList<>();
        if(!file.exists()){
            System.err.println("\\u001B[32m File not found: " + new File(CARDS_DATA_PATH).getAbsolutePath());
            return idList;
        }

        List<Map<String, Object>> cards = new ArrayList<>();
        try (Reader reader = new FileReader(file)) {
            cards = objectMapper.readValue(reader, new TypeReference<List<Map<String, Object>>>(){});
        } catch (IOException error) {
            error.printStackTrace();
            return idList;
        }

        for(Map<String, Object> card: cards) {
            Object cardCode = card.get("card_code");
            switch(type){
                case PROJECT:
                    if((card.get("cardType").equals("corporation")) && cardCode instanceof String){continue;}
                    break;
                case CORPORATION:
                    if((!card.get("cardType").equals("corporation")) && cardCode instanceof String){continue;}
                    break;
            }
            if((card.get("status").equals("blocked") && cardCode instanceof String)){continue;}
            idList.add(cardCode.toString());
        }

        return idList;
    }
    private static void checkDatabaseExistOrCreateIt(){
        File f = new File(DATABASE_PATH);
        
        if (!f.isFile()) {
            try {  
                Files.createDirectories(Paths.get(DATABASE_DIRECTORY));
                objectMapper.enable(SerializationFeature.INDENT_OUTPUT);
                objectMapper.writeValue(f, new HashMap<String, GameData>());
            } catch (IOException e) {  
                e.printStackTrace();  
            } 
        }
    }
}
