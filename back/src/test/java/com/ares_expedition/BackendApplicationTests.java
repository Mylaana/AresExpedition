package com.ares_expedition;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import com.ares_expedition.dto.websocket.messages.input.BaseMessageDTO;
import com.ares_expedition.enums.game.PhaseEnum;
import com.ares_expedition.dto.websocket.content.player.*;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootTest
class BackendApplicationTests {

	@Test
	void contextLoads() {
	}


	@Test
	void testDeserializationReadyQuery() throws Exception {
		ObjectMapper mapper = new ObjectMapper();

		String json = """
		{
			"gameId": 1,
			"playerId": 0,
			"content": { "ready": true },
			"contentEnum": "READY_QUERY"
		}
		""";

		BaseMessageDTO<PlayerReadyContentDTO> query = mapper.readValue(json, new TypeReference<>() {});

		assertNotNull(query.getContent());
		assertTrue(query.getContent().getReady());
	}
	@Test
	void testDeserializationPhaseSelected() throws Exception {
		ObjectMapper mapper = new ObjectMapper();

		String json = """
		{
			"gameId": 1,
			"playerId": 0,
			"content": { "phase": "CONSTRUCTION" },
			"contentEnum": "SELECTED_PHASE_QUERY"
		}
		""";

		BaseMessageDTO<PhaseSelectedContentDTO> query = mapper.readValue(json, new TypeReference<>() {});

		assertNotNull(query.getContent());
		assertEquals(query.getContent().getPhase(), PhaseEnum.CONSTRUCTION);
	}
	@Test
	void testDeserializationDebug() throws Exception {
		ObjectMapper mapper = new ObjectMapper();

		String json = """
		{
			"gameId": 1,
			"playerId": 0,
			"content": { "content": "SET_BOTS_READY" },
			"contentEnum": "DEBUG"
		}
		""";

		BaseMessageDTO<GenericContentDTO> query = mapper.readValue(json, new TypeReference<>() {});

		assertNotNull(query.getContent());
		assertEquals(query.getContent().getContent(), "SET_BOTS_READY");
	}
	@Test
	void testDeserializationPlayerStatePush() throws Exception {
		ObjectMapper mapper = new ObjectMapper();

		String json = """
		{
			"gameId": 1,
			"playerId": 0,
			"content": {
				"id": 0,
				"name": "joueur 1",
				"color": "rgb(0, 0, 255)",
				"ressource": [
				{
					"id": 0,
					"name": "megacredit",
					"valueMod": 0,
					"valueProd": 0,
					"valueBaseProd": 0,
					"valueStock": 52,
					"hasStock": true,
					"imageUrlId": 1009
				},
				{
					"id": 1,
					"name": "heat",
					"valueMod": 0,
					"valueProd": 0,
					"valueBaseProd": 0,
					"valueStock": 0,
					"hasStock": true,
					"imageUrlId": 1007
				},
				{
					"id": 2,
					"name": "plant",
					"valueMod": 0,
					"valueProd": 0,
					"valueBaseProd": 0,
					"valueStock": 0,
					"hasStock": true,
					"imageUrlId": 6
				},
				{
					"id": 3,
					"name": "steel",
					"valueMod": 2,
					"valueProd": 0,
					"valueBaseProd": 0,
					"valueStock": 0,
					"hasStock": false,
					"imageUrlId": 1000
				},
				{
					"id": 4,
					"name": "titanium",
					"valueMod": 3,
					"valueProd": 0,
					"valueBaseProd": 0,
					"valueStock": 0,
					"hasStock": false,
					"imageUrlId": 1001
				},
				{
					"id": 5,
					"name": "card",
					"valueMod": 0,
					"valueProd": 0,
					"valueBaseProd": 0,
					"valueStock": 0,
					"hasStock": false,
					"imageUrlId": 102
				}
				],
				"terraformingRating": 5,
				"vp": 5,
				"tag": [
				{
					"id": 0,
					"name": "building",
					"idImageUrl": 0,
					"valueCount": 0,
					"valueMod": 0
				},
				{
					"id": 1,
					"name": "space",
					"idImageUrl": 1,
					"valueCount": 0,
					"valueMod": 0
				},
				{
					"id": 2,
					"name": "science",
					"idImageUrl": 2,
					"valueCount": 0,
					"valueMod": 0
				},
				{
					"id": 3,
					"name": "power",
					"idImageUrl": 3,
					"valueCount": 0,
					"valueMod": 0
				},
				{
					"id": 4,
					"name": "earth",
					"idImageUrl": 4,
					"valueCount": 0,
					"valueMod": 0
				},
				{
					"id": 5,
					"name": "jovian",
					"idImageUrl": 5,
					"valueCount": 0,
					"valueMod": 0
				},
				{
					"id": 6,
					"name": "plant",
					"idImageUrl": 6,
					"valueCount": 0,
					"valueMod": 0
				},
				{
					"id": 7,
					"name": "animal",
					"idImageUrl": 7,
					"valueCount": 0,
					"valueMod": 0
				},
				{
					"id": 8,
					"name": "microbe",
					"idImageUrl": 8,
					"valueCount": 0,
					"valueMod": 0
				},
				{
					"id": 9,
					"name": "event",
					"idImageUrl": 9,
					"valueCount": 0,
					"valueMod": 0
				}
				],
				"research": {
				"keep": 0,
				"scan": 0
				},
				"phaseCardUpgradeCount": 0,
				"sellCardValueMod": 0,
				"milestoneCount": 3,
				"globalParameter": {
				"globalParameterIndex": {},
				"parameters": [
					{
					"name": "infrastructure",
					"value": 0,
					"addEndOfPhase": 0
					},
					{
					"name": "ocean",
					"value": 0,
					"addEndOfPhase": 0
					},
					{
					"name": "oxygen",
					"value": 0,
					"addEndOfPhase": 0
					},
					{
					"name": "temperature",
					"value": 0,
					"addEndOfPhase": 0
					}
				]
				}
			},
			"contentEnum": "PLAYER_STATE_PUSH"
			}
		""";

		BaseMessageDTO<PlayerStateContentDTO> query = mapper.readValue(json, new TypeReference<>() {});

		assertNotNull(query.getContent());
		//assert(query.getContent().getContent(), "SET_BOTS_READY");
	}
}
