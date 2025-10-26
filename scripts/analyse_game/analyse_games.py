"""
parsing archived games into single output
"""
import os
import json
from parsed_class.class_definition import GameState


def getWinner(data):
    for player in data['groupPlayerState']:
        print(data)


def main():
    archives_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__))) + "/data/archives/"

    for file in os.listdir(archives_dir):
        with open(archives_dir + file, 'r', encoding='utf-8') as file:
            file_data = json.load(file)
            game = GameState(**file_data)
            print(game.gameId + ':')
            print(game.getWinner())
            """print(getWinner(file_data))"""


if __name__ == '__main__':
    main()
