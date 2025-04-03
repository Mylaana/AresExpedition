    package com.ares_expedition.repository;

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
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

public class JsonGameDataHandler {
    private static final String FILE_PATH = "back/data/database.json";
    private static final ObjectMapper objectMapper = new ObjectMapper();

    public static Game getGame(String gameId){
        System.out.println("\u001B[31m GET GAME \u001B[0m");
        Map<String, Game> games = readGames();
        return games.getOrDefault(gameId, new Game());
    }

    public static Map<String, Game> getAllGames() {
        System.out.println("\u001B[31m GET ALL GAMES \u001B[0m");
        Map<String, Game> games = readGames();
        System.out.println("games loaded");
        return games;
    }

    public static void saveGame(Game saveGame) {
        System.out.println("\u001B[31m SAVE GAME \u001B[0m");
        Map<String, Game> games = readGames();
        Map<String, GameData> gamesDTO = Game.toDataMap(games);
        gamesDTO.put(saveGame.getGameId(), saveGame.toData());
        writeGames(gamesDTO);
    }

    private static Map<String, Game> readGames(){
        File file = Paths.get(FILE_PATH).toFile();
        //System.out.println("\u001B[32m \u001B[0m");
        if(!file.exists()){
            System.err.println("\\u001B[32m File not found: " + new File("back/").getAbsolutePath());
            return new HashMap<>();
        }

        try (Reader reader = new FileReader(file)){
            return objectMapper.readValue(reader, new TypeReference<Map<String, Game>>(){});
        } catch (IOException error) {
            error.printStackTrace();
            return new HashMap<>();
        }

    }

    private static void writeGames(Map<String, GameData> games){
        try (Writer writer = new FileWriter(Paths.get(FILE_PATH).toFile())) {
            objectMapper.enable(SerializationFeature.INDENT_OUTPUT);
            objectMapper.writerWithDefaultPrettyPrinter().writeValue(writer, games);
        } catch (IOException error) {
            error.printStackTrace();
        }
    }
}
