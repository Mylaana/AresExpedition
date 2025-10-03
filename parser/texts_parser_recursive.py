import csv
import os
import json
import copy
import traceback

def fill_language(header: list, line: list, start_index: int): 
    result: dict = {}
    for index in range(start_index, len(line)):
        result[header[index]] =  line[index]

    return result

def fill_block(header: list, unparsed: list, current_level: int, current_level_value: str = ''):
    # exit condition
    if len(unparsed) == 0:
        return

    block: dict = {}

    while len(unparsed) > 0 :
        block_caption = unparsed[0][current_level +1]
        result = {}

        cursor_value = copy.deepcopy(unparsed[0][current_level])
        if cursor_value != current_level_value  or current_level_value is None:
            break

        if header[current_level +1].find('level') == -1:
            result = fill_language(header, unparsed[0], current_level +1)
            unparsed.pop(0)
            return result
        else:
            result = fill_block(header, unparsed, current_level +1, unparsed[0][current_level +1])
            block[block_caption] = result
    
    return block

def fill_dict(header: list, unparsed: list):
    result: dict = {}

    while len(unparsed) > 0:
        caption = unparsed[0][0]
        result[caption] = fill_block(header, unparsed, 0, caption)

    return result

def main():
    dir_name = os.path.dirname(__file__)
    input_path = os.path.join(dir_name, 'Input/')
    input_name = 'texts'
    output_path = os.path.join(os.path.abspath(os.path.join(dir_name, os.pardir)), 'data')
    output_name = 'game-text.json'

    parsed = []
    with open(file=input_path + input_name + ".csv", mode="r") as csvfile:
        reader = csv.reader(csvfile, delimiter=';')
        skipped_header = False
        unparsed = []
        header = []

        for row in reader:
            if not skipped_header:
                skipped_header = True
                header = row
                continue
            if row[0] == '':
                continue
            
            unparsed.append(row)
        parsed = fill_dict(header, unparsed)

    with open(os.path.join(output_path, output_name), 'w') as f:
        json.dump(parsed, f, indent=4)

    print('Done')


if __name__ == '__main__':
    try:
        main()
    except Exception:
        traceback.print_exc()
        print('File must be a csv separated with ";"')
