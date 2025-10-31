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
    BASE_DIR = os.getcwd()  # os.path.dirname(os.path.abspath(os.path.dirname(__file__)))
    ARCHIVES_DIR = os.path.join(BASE_DIR, "data/archives")
    CARD_INFO_DIR = os.path.join(BASE_DIR, "data")
    CARD_INFO_PATH = os.path.join(CARD_INFO_DIR, "cards_data.json")
    RESULT_DIR = os.path.join(BASE_DIR, "data")
    RESULT_PATH = os.path.join(RESULT_DIR, "analyzed_games.json")

    card_info: CardInfo
    print("Result file:", RESULT_PATH)
    print("Current working dir:", os.getcwd())
    print("Script dir:", BASE_DIR)

    with open(CARD_INFO_PATH, 'r', encoding='utf-8') as file:
        file_data = json.load(file)
        card_info = CardInfo(cards=file_data)

    stats = ParsedStats(card_info=card_info)

    for file in os.listdir(ARCHIVES_DIR):
        with open(os.path.join(ARCHIVES_DIR, file), 'r', encoding='utf-8') as file:
            file_data = json.load(file)
            game = GameState(**file_data)
            winner = game.getWinner()

            if winner == 'solo':
                print(game.gameId, 'excluded(solo)')
                continue

            if winner != 'draw':
                stats.load_game(game)

    with open(RESULT_PATH, "w") as outfile:
        outfile.write(stats.to_json())


if __name__ == '__main__':
    main()
