import csv
import os
import json
import copy
import traceback


parser_columns_map = [
    {'column_name': 'title', 'column_id': -1 , 'output_field_name': '', 'split_per_language': False},
    {'column_name': 'card_code', 'column_id': -1 , 'output_field_name': 'card_code', 'split_per_language': False},
    {'column_name': 'origin', 'column_id': -1 , 'output_field_name': 'origin', 'split_per_language': False},
    {'column_name': 'phaseUp', 'column_id': -1 , 'output_field_name': 'phaseUp', 'split_per_language': False},
    {'column_name': 'phaseDown', 'column_id': -1 , 'output_field_name': 'phaseDown', 'split_per_language': False},
    {'column_name': 'cost', 'column_id': -1 , 'output_field_name': 'cost', 'split_per_language': False},
    {'column_name': 'card_Type', 'column_id': -1 , 'output_field_name': 'cardType', 'split_per_language': False},
    {'column_name': 'tagsId', 'column_id': -1 , 'output_field_name': 'tagsId', 'split_per_language': False},
    {'column_name': 'vpNumber', 'column_id': -1 , 'output_field_name': 'vpNumber', 'split_per_language': False},
    {'column_name': 'effectSummaryType', 'column_id': -1 , 'output_field_name': 'effectSummaryType', 'split_per_language': False},
    {'column_name': 'effectSummaryType2', 'column_id': -1 , 'output_field_name': 'effectSummaryType2', 'split_per_language': False},
    {'column_name': 'prerequisiteType', 'column_id': -1 , 'output_field_name': '', 'split_per_language': False},
    {'column_name': 'prerequisiteTresholdType', 'column_id': -1 , 'output_field_name': '', 'split_per_language': False},
    {'column_name': 'prerequisiteTag', 'column_id': -1 , 'output_field_name': '', 'split_per_language': False},
    {'column_name': 'prerequisiteTagId', 'column_id': -1 , 'output_field_name': '', 'split_per_language': False},
    {'column_name': 'prerequisiteTresholdStep', 'column_id': -1 , 'output_field_name': '', 'split_per_language': False},
    {'column_name': 'prerequisiteTresholdValue', 'column_id': -1 , 'output_field_name': '', 'split_per_language': False},
    {'column_name': 'stockableRessource', 'column_id': -1 , 'output_field_name': 'stockable', 'split_per_language': False},
    {'column_name': 'startingMegacredits', 'column_id': -1 , 'output_field_name': 'startingMegacredits', 'split_per_language': False},
    {'column_name': 'status', 'column_id': -1 , 'output_field_name': 'status', 'split_per_language': False},
    {'column_name': 'effectSummaryOption', 'column_id': -1 , 'output_field_name': 'effectSummaryOption', 'split_per_language': False},
    {'column_name': 'effectSummaryOption2', 'column_id': -1 , 'output_field_name': 'effectSummaryOption2', 'split_per_language': False},
    {'column_name': 'vpScaling', 'column_id': -1 , 'output_field_name': 'vpScaling', 'split_per_language': False},
    {'column_name': 'balancedVersion', 'column_id': -1 , 'output_field_name': 'balancedVersion', 'split_per_language': False},

    {'column_name': 'title_en', 'column_id': -1 , 'output_field_name': 'title', 'split_per_language': True},
    {'column_name': 'title_fr', 'column_id': -1 , 'output_field_name': 'title', 'split_per_language': True},
    {'column_name': 'vpText_en', 'column_id': -1 , 'output_field_name': 'vpText', 'split_per_language': True},
    {'column_name': 'vpText_fr', 'column_id': -1 , 'output_field_name': 'vpText', 'split_per_language': True},
    {'column_name': 'effectSummaryText_en', 'column_id': -1 , 'output_field_name': 'effectSummaryText', 'split_per_language': True},
    {'column_name': 'effectSummaryText_fr', 'column_id': -1 , 'output_field_name': 'effectSummaryText', 'split_per_language': True},
    {'column_name': 'effectText_en', 'column_id': -1 , 'output_field_name': 'effectText', 'split_per_language': True},
    {'column_name': 'effectText_fr', 'column_id': -1 , 'output_field_name': 'effectText', 'split_per_language': True},
    {'column_name': 'effectSummaryText2_en', 'column_id': -1 , 'output_field_name': 'effectSummaryText2', 'split_per_language': True},
    {'column_name': 'effectSummaryText2_fr', 'column_id': -1 , 'output_field_name': 'effectSummaryText2', 'split_per_language': True},
    {'column_name': 'effectText2_en', 'column_id': -1 , 'output_field_name': 'effectText2', 'split_per_language': True},
    {'column_name': 'effectText2_fr', 'column_id': -1 , 'output_field_name': 'effectText2', 'split_per_language': True},
    {'column_name': 'playedText_en', 'column_id': -1 , 'output_field_name': 'playedText', 'split_per_language': True},
    {'column_name': 'playedText_fr', 'column_id': -1 , 'output_field_name': 'playedText', 'split_per_language': True},
    {'column_name': 'prerequisiteText_en', 'column_id': -1 , 'output_field_name': 'prerequisiteText', 'split_per_language': True},
    {'column_name': 'prerequisiteText_fr', 'column_id': -1 , 'output_field_name': 'prerequisiteText', 'split_per_language': True},
    {'column_name': 'prerequisiteSummaryText_en', 'column_id': -1 , 'output_field_name': 'prerequisiteSummaryText', 'split_per_language': True},
    {'column_name': 'prerequisiteSummaryText_fr', 'column_id': -1 , 'output_field_name': 'prerequisiteSummaryText', 'split_per_language': True},
    {'column_name': 'actionTextOption1_en', 'column_id': -1 , 'output_field_name': 'actionTextOption1', 'split_per_language': True},
    {'column_name': 'actionTextOption1_fr', 'column_id': -1 , 'output_field_name': 'actionTextOption1', 'split_per_language': True},
    {'column_name': 'actionTextOption2_en', 'column_id': -1 , 'output_field_name': 'actionTextOption2', 'split_per_language': True},
    {'column_name': 'actionTextOption2_fr', 'column_id': -1 , 'output_field_name': 'actionTextOption2', 'split_per_language': True},    ]

PARSER_CARD_INFO_MODEL = {
    "card_code": "",
    "origin": "",
    "cost": 0,
    "tagsId": [],
    "cardType": "",
    "vpNumber": "",
    "prerequisiteTresholdType": "",
    "prerequisiteType": "",
    "prerequisiteTresholdValue": 0,
    "phaseUp": "",
    "phaseDown": "",
    "title": {},
    "vpText": {},
    "effectSummaryType": "",
    "effectSummaryText": {},
    "effectText": {},
    "effectSummaryOption": "",
    "effectSummaryType2": "",
    "effectSummaryText2": {},
    "effectText2": {},
    "effectSummaryOption2": "",
    "playedText": {},
    "prerequisiteText": {},
    "prerequisiteSummaryText": {},
    "stockable": [],
    "startingMegacredits": 0,
    "status": "",
    "actionTextOption1": {},
    "actionTextOption2": {},
    "actionText2Option1": {},
    "actionText2Option2": {},
    "vpScaling": "",
    "balancedVersion": ""
}

AUTHORIZED_STATUS = ['implemented', 'validated', 'bugged', 'filled', 'blocked']


def map_csv_columns(csv_header: str):
    for column_index in range(len(csv_header)):
        for c in parser_columns_map:
            if c['column_name'] == csv_header[column_index]:
                c['column_id'] = column_index
                break

def is_empty_dict(input: dict):
    if not isinstance(input, dict):
        return False
    all_empty = True
    for i in input:
        if input[i] != '':
            all_empty = False
            break
    return all_empty


def remove_unused_fields(input: dict):
    cleaned_row: dict = {}
    if not isinstance(input, dict):
        print('not a dict:')
        print(input)
        return input

    for key in input:
        if input[key] == '':
            continue
        if input[key] == 0:
            continue
        if is_empty_dict(input[key]):
            continue
        if input[key] == []:
            continue
        cleaned_row[key] = input[key]

    return cleaned_row


def parse_row(csv_row: str):
    """
    gets:
     - csv row (list)

    returns:
     - card info (dict)
    """
    for map in parser_columns_map:
        parsed_row = PARSER_CARD_INFO_MODEL
        parsed_value = ''
        if map['output_field_name'] == '':
            continue

        if csv_row[0] not in AUTHORIZED_STATUS:
            return

        if map['split_per_language'] is True:
            language = map['column_name'].split('_')[1]
            parsed_row[map['output_field_name']][language] = csv_row[map['column_id']]
            continue

        parsed_value = csv_row[map['column_id']]

        match str(type(PARSER_CARD_INFO_MODEL[map['output_field_name']])):
            case "<class 'list'>":
                if parsed_value == '':
                    parsed_value = []
                else:
                    parsed_value = parsed_value.split(',')

                parsed_row[map['output_field_name']] = parsed_value

                for index in range(len(parsed_value)):
                    if parsed_value[index] == '':
                        continue

                    match map['output_field_name']:
                        case 'tagsId':
                            parsed_value[index] = int(parsed_value[index])
                        case _:
                            parsed_value[index] = parsed_value[index]
            case "<class 'int'>":
                if not parsed_value:
                    parsed_value = 0
                if parsed_value == '':
                    parsed_value = 0
                parsed_row[map['output_field_name']] = int(parsed_value)
            case _:
                parsed_row[map['output_field_name']] = parsed_value
    
    return parsed_row


def main():
    dir_name = os.path.dirname(__file__)
    input_path = os.path.join(dir_name, 'Input/')
    input_name = 'card_list'
    output_path = os.path.join(os.path.abspath(os.path.join(dir_name, os.pardir)), 'data')
    output_name = 'cards_data.json'

    parsed = []
    with open(file=input_path + input_name + ".csv", mode="r") as csvfile:
        reader = csv.reader(csvfile, delimiter=';')
        skipped_header = False
        for row in reader:
            if not skipped_header:
                skipped_header = True
                map_csv_columns(row)
                continue
            if row[0] == '':
                continue

            result = parse_row(row)

            if result:
                result = remove_unused_fields(result)
                parsed.append(copy.deepcopy(result))

    with open(os.path.join(output_path, output_name), 'w') as f:
        json.dump(parsed, f, indent=4)

    print('Done')


if __name__ == '__main__':
    try:
        main()
    except Exception:
        traceback.print_exc()
        print('File must be a csv separated with ";"')
