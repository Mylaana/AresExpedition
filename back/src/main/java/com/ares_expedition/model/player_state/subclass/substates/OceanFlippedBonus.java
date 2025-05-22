package com.ares_expedition.model.player_state.subclass.substates;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.ares_expedition.enums.game.RessourceEnum;

public class OceanFlippedBonus {
	private List<Map<RessourceEnum, Integer>> oceanFlippedBonus = new ArrayList<>();

	public OceanFlippedBonus(){
		
	}
	public OceanFlippedBonus(List<Map<String, Integer>> dto) {
		this.oceanFlippedBonus = this.oceanFlippedBonusFromJson(dto);
	}

	public List<Map<RessourceEnum, Integer>> getOceanFlippedBonus() {
		return oceanFlippedBonus;
	}

	public void setOceanFlippedBonus(List<Map<RessourceEnum, Integer>> oceanFlippedBonus) {
		this.oceanFlippedBonus = oceanFlippedBonus;
	}

	public void addFlippedBonus(Map<RessourceEnum, Integer> bonuses){
		this.oceanFlippedBonus.add(bonuses);
	}
	
	public List<Map<String, Integer>> toJson() {
		List<Map<String, Integer>> dto = new ArrayList<>();
		for(Map<RessourceEnum, Integer> oceanBonus: this.oceanFlippedBonus){
			Map<String, Integer> bonusDTO = new HashMap<>();
			//convert ressource enum to label
			for(Map.Entry<RessourceEnum, Integer> entry: oceanBonus.entrySet()){
				bonusDTO.put(entry.getKey().getDto(), entry.getValue());
			}
			dto.add(bonusDTO);
		}
		return dto;
	}

	public static OceanFlippedBonus fromJson(List<Map<String, Integer>> dto) {
		return new OceanFlippedBonus(dto);
	}

	private List<Map<RessourceEnum, Integer>> oceanFlippedBonusFromJson(List<Map<String, Integer>> dto){
		List<Map<RessourceEnum, Integer>> oceanFlippedBonus = new ArrayList<>();
		for(Map<String, Integer> oceanBonus: dto){
			Map<RessourceEnum, Integer> bonusState = new HashMap<>();
			//convert ressource labels to enum

			for(Map.Entry<String, Integer> entry: oceanBonus.entrySet()){
				RessourceEnum r = RessourceEnum.toEnum(entry.getKey());
				if(r!=RessourceEnum.UNDEFINED){
					bonusState.put(r, entry.getValue());
				}
			}
			oceanFlippedBonus.add(bonusState);
		}
		return oceanFlippedBonus;
	}
}
