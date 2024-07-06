import csv
import os
import json


parser_columns_map = [
    {'column_name': 'id', 'column_id': -1 , 'output_field_name': 'id', 'split_per_language': False},
    {'column_name': 'title', 'column_id': -1 , 'output_field_name': '', 'split_per_language': False},
    {'column_name': 'card_code', 'column_id': -1 , 'output_field_name': 'card_code', 'split_per_language': False},
    {'column_name': 'origin', 'column_id': -1 , 'output_field_name': 'origin', 'split_per_language': False},
    {'column_name': 'phaseUp', 'column_id': -1 , 'output_field_name': 'phaseUp', 'split_per_language': False},
    {'column_name': 'phaseDown', 'column_id': -1 , 'output_field_name': 'phaseDown', 'split_per_language': False},
    {'column_name': 'cost', 'column_id': -1 , 'output_field_name': 'cost', 'split_per_language': False},
    {'column_name': 'card_Type', 'column_id': -1 , 'output_field_name': 'cardType', 'split_per_language': False},
    {'column_name': 'tagsId', 'column_id': -1 , 'output_field_name': 'tagsId', 'split_per_language': False},
    {'column_name': 'vpNumber', 'column_id': -1 , 'output_field_name': 'vpNumber', 'split_per_language': False},
    {'column_name': 'effectSummaryType', 'column_id': -1 , 'output_field_name': '', 'split_per_language': False},
    {'column_name': 'prerequisiteType', 'column_id': -1 , 'output_field_name': '', 'split_per_language': False},
    {'column_name': 'prerequisiteTresholdType', 'column_id': -1 , 'output_field_name': '', 'split_per_language': False},
    {'column_name': 'prerequisiteTag', 'column_id': -1 , 'output_field_name': '', 'split_per_language': False},
    {'column_name': 'prerequisiteTagId', 'column_id': -1 , 'output_field_name': '', 'split_per_language': False},
    {'column_name': 'prerequisiteTresholdStep', 'column_id': -1 , 'output_field_name': '', 'split_per_language': False},
    {'column_name': 'prerequisiteTresholdValue', 'column_id': -1 , 'output_field_name': '', 'split_per_language': False},
    {'column_name': 'stockableRessource', 'column_id': -1 , 'output_field_name': '', 'split_per_language': False},
    {'column_name': 'title_en', 'column_id': -1 , 'output_field_name': 'title', 'split_per_language': True},
    {'column_name': 'title_fr', 'column_id': -1 , 'output_field_name': 'title', 'split_per_language': True},
    {'column_name': 'description_en', 'column_id': -1 , 'output_field_name': '', 'split_per_language': False},
    {'column_name': 'description_fr', 'column_id': -1 , 'output_field_name': '', 'split_per_language': False},
    {'column_name': 'vpText_en', 'column_id': -1 , 'output_field_name': '', 'split_per_language': False},
    {'column_name': 'vpText_fr', 'column_id': -1 , 'output_field_name': '', 'split_per_language': False},
    {'column_name': 'effectSummaryText_en', 'column_id': -1 , 'output_field_name': '', 'split_per_language': False},
    {'column_name': 'effectSummaryText_fr', 'column_id': -1 , 'output_field_name': '', 'split_per_language': False},
    {'column_name': 'effectText_en', 'column_id': -1 , 'output_field_name': '', 'split_per_language': False},
    {'column_name': 'effectText_fr', 'column_id': -1 , 'output_field_name': '', 'split_per_language': False},
    {'column_name': 'playedText_en', 'column_id': -1 , 'output_field_name': 'playedText', 'split_per_language': True},
    {'column_name': 'playedText_fr', 'column_id': -1 , 'output_field_name': 'playedText', 'split_per_language': True},
    {'column_name': 'prerequisiteText_en', 'column_id': -1 , 'output_field_name': '', 'split_per_language': False},
    {'column_name': 'prerequisiteText_fr', 'column_id': -1 , 'output_field_name': '', 'split_per_language': False},
    {'column_name': 'descriptionPrerequisiteSummary_en', 'column_id': -1 , 'output_field_name': '', 'split_per_language': False},
    {'column_name': 'descriptionPrerequisiteSummary_fr', 'column_id': -1 , 'output_field_name': '', 'split_per_language': False}
    ]

PARSER_CARD_INFO_MODEL = {
    "id": 0,
    "card_code": "",
    "origin": "",
    "cost": 0,
    "tagsId": [],
    "cardSummaryType": "",
    "cardType": "",
    "vpNumber": "",
    "prerequisiteTresholdType": "",
    "prerequisiteType": "",
    "prerequisiteTresholdValue": 0,
    "phaseUp": "",
    "phaseDown": "",
    "title": {
        "en":"",
        "fr":""
    },
    "playedText":{
        "en":"",
        "fr":""
    },
    "descriptionPrerequisite": {
        "en":"",
        "fr":""
    },
    "descriptionPrerequisiteSummary": {
        "en": "",
        "fr": ""
    },
    "descriptionVp": {
        "en":"",
        "fr":""
    },
    "descriptionEffect": {
        "en":"",
        "fr":""
    },
    "descriptionSummary": {
        "en": "",
        "fr": ""
    }
}

def map_csv_columns(csv_header: str):
    for column_index in range(len(csv_header)):
        for c in parser_columns_map:
            if c['column_name']==csv_header[column_index]:
                c['column_id'] = column_index
                break

def parse_row(csv_row: str):
    """
    gets:
     - csv row (list)

    returns:
     - card info (dict)
    """
    for map in parser_columns_map:
        parsed_row = PARSER_CARD_INFO_MODEL
        if map['output_field_name'] == '':
            continue

        if map['split_per_language'] == True:
            language = map['column_name'].split('_')[1]
            parsed_row[map['output_field_name']][language] = csv_row[map['column_id']]
            continue

        parsed_row[map['output_field_name']] = csv_row[map['column_id']]
    return parsed_row


def main():
    input_path = os.path.join(os.path.dirname(__file__), 'Input/')
    input_name = 'card_list'
    output_path = os.path.dirname(__file__)
    output_name = 'cards_data.json'
    
    parsed = []

    with open(file=input_path + input_name + ".csv", mode="r", encoding="utf-8") as csvfile:
        reader = csv.reader(csvfile)
        skipped_header = False
        for row in reader:
            if not skipped_header:
                skipped_header = True
                map_csv_columns(row)
                continue

            parsed.append(parse_row(row).copy())
        
        with open(os.path.join(output_path, output_name), 'w') as f:
            json.dump(parsed, f, indent=4)

if __name__ == '__main__':
    main()