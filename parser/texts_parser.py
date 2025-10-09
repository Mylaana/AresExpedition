import csv
import os
import json
import traceback


def fill_language(header: list, line: list, start_index: int): 
    result: dict = {}
    for index in range(start_index, len(header)):
        if header[index] == '':
            continue
        result[header[index]] = line[index]

    return result


def fill_block(header: list, unparsed: list):
    result: list = []
    index = 0
    caption = ''
    while header[index].find('level') != -1:
        if unparsed[0][index] == '':
            index += 1
            continue

        if caption != '':
            caption = caption + '.'

        caption = caption + unparsed[0][index]
        index += 1
    
    result.append(caption)
    result.append(fill_language(header, unparsed[0], index))
    unparsed.pop(0)
    
    return result


def fill_dict(header: list, unparsed: list):
    result: dict = {}

    while len(unparsed) > 0:
        block = fill_block(header, unparsed)
        result[block[0]] = block[1]

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
