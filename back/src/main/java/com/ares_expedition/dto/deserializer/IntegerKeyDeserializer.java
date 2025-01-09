package com.ares_expedition.dto.deserializer;

import com.fasterxml.jackson.databind.KeyDeserializer;
import com.fasterxml.jackson.databind.DeserializationContext;

import java.io.IOException;

public class IntegerKeyDeserializer extends KeyDeserializer {
    @Override
    public Integer deserializeKey(String key, DeserializationContext ctxt) throws IOException {
        try {
            return Integer.valueOf(key);
        } catch (NumberFormatException e) {
            throw new IOException("Invalid key for Map<Integer, ?>: " + key, e);
        }
    }
}
