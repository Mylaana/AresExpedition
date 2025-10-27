"""
parsing archived games into single output
"""
import os
import json
from parsed_class.class_definition import GameState, ParsedStats, CardInfo


def getWinner(data):
    for player in data['groupPlayerState']:
        print(data)


def main():
    project_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    archives_dir = project_dir + "/data/archives/"
    card_info_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__))) + "/data/"
    card_info: CardInfo
    result_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__))) + "/data/"

    with open(card_info_dir + "cards_data.json", 'r', encoding='utf-8') as file:
        file_data = json.load(file)
        card_info = CardInfo(cards=file_data)

    stats = ParsedStats(card_info=card_info)

    for file in os.listdir(archives_dir):
        with open(archives_dir + file, 'r', encoding='utf-8') as file:
            file_data = json.load(file)
            game = GameState(**file_data)
            winner = game.getWinner()
            if winner != 'draw':
                stats.load_game(game)

            """print(getWinner(file_data))"""

    with open(result_dir + "analyzed_games.json", "w") as outfile:
        outfile.write(stats.to_json())


if __name__ == '__main__':
    main()
