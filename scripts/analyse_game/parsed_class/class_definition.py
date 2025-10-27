from pydantic import BaseModel, ConfigDict
from . import enums_definition as e


class PlayerStatState(BaseModel):
    selectedPhaseRound: dict[str, e.PhaseNameEnum]


class PlayedCardState(BaseModel):
    s: list
    t: list


class PlayerStateCard(BaseModel):
    cardPlayed: dict[str, PlayedCardState]


class ResourceInfo(BaseModel):
    id: int
    name: e.ResourceTypeEnum
    valueStock: int

    def getTieStock(self) -> int:
        if self.name in [e.ResourceTypeEnum.megacredit, e.ResourceTypeEnum.heat, e.ResourceTypeEnum.plant]:
            return self.valueStock

        return 0


class PlayerStateResource(BaseModel):
    ressources: list[ResourceInfo]

    def getTieResourceTotal(self) -> int:
        total = 0
        for r in self.ressources:
            total += r.getTieStock()
        return total


class PlayerStateScore(BaseModel):
    vp: int
    terraformingRating: int
    forest: int
    award: int
    claimedMilestone: list
    habitat: int
    mine: int

    def getTotalScore(self):
        return (self.vp + self.terraformingRating + self.forest + self.award + len(self.claimedMilestone) * 3
                + self.habitat + self.mine)


class PlayerStateInfo(BaseModel):
    id: str
    name: str


class PlayerState(BaseModel):
    infoState: PlayerStateInfo
    scoreState: PlayerStateScore
    ressourceState: PlayerStateResource
    projectCardState: PlayerStateCard

    def getScore(self):
        return self.scoreState.getTotalScore()

    def getTieScore(self):
        return self.scoreState.getTotalScore() + self.ressourceState.getTieResourceTotal()


class GameOptions(BaseModel):
    options: dict[str, dict]


class GlobalParameter(BaseModel):
    name: e.GlobalParameterNameEnum
    step: int


class GameState(BaseModel):
    gameId: str
    groupPlayerId: list[str]
    globalParameters: list[GlobalParameter]
    gameOptions: GameOptions
    groupPlayerState: dict[str, PlayerState]

    def getTieWinner(self) -> str:
        return 'pouet'

    def getWinner(self, tie: bool = False) -> str:
        max_score = -1
        max_score_player_name = ''
        tie_counter = 0

        for name in self.groupPlayerState:
            player = self.groupPlayerState[name]

            if tie is False:
                player_score = player.getScore()
            else:
                player_score = player.getTieScore()

            if player_score == max_score:
                tie_counter += 1

            if player_score > max_score:
                max_score = player_score
                max_score_player_name = name

        if tie_counter > 0:
            if tie:
                return 'draw'

            return self.getWinner(True)

        return max_score_player_name


class Card(BaseModel):
    card_code: str
    cardType: e.CardTypeEnum


class CardStatExport(BaseModel):
    code: str
    played: int
    win: int
    type: e.CardTypeEnum
    winrate: int

    model_config = ConfigDict(use_enum_values=True)


class CardStat():
    def __init__(self, card: Card):
        self.code = card.card_code
        self.played: int = 0
        self.win: int = 0
        self.type: e.CardTypeEnum = card.cardType

    def addResult(self, win: bool):
        if win:
            self.addWin()
        else:
            self.addLoss()

    def addWin(self):
        self.win += 1
        self.played += 1

    def addLoss(self):
        self.played += 1

    def getWinrate(self) -> float:
        if self.played == 0:
            return 0
        return round(self.win * 100 / self.played)


class CardInfo(BaseModel):
    cards: list[Card]

    def toCardStats(self) -> dict[str, CardStat]:
        result: dict[str, CardStat] = {}

        for c in self.cards:
            result[c.card_code] = CardStat(c)

        return result


class ParsedStatsExport(BaseModel):
    card_stats: list[CardStatExport]


class ParsedStats():
    def __init__(self, card_info: CardInfo):
        self.card_info: CardInfo = card_info
        self.card_stats: dict[str, CardStat]

        self.initializeCard()

    def load_game(self, game: GameState):
        winner_id = game.getWinner()

        for p in game.groupPlayerState:
            self.treatPlayerStats(game.groupPlayerState[p], p == winner_id)

        print(game.gameId + ' loaded')

    def initializeCard(self):
        self.card_stats = self.card_info.toCardStats()

    def treatPlayerStats(self, player: PlayerState, win: bool):
        self.treatCardResult(player.projectCardState, win)

    def treatCardResult(self, card_state: PlayerStateCard, win: bool):
        for c in card_state.cardPlayed:
            self.addCardResult(c, win)

    def addCardResult(self, card_code: str, win: bool):
        self.card_stats[card_code].addResult(win)

    def to_json(self) -> str:
        """formats and dumps final state using pydantic"""
        export_model = ParsedStatsExport(
            card_stats=list(self.card_stats.items())
        )
        """
            {
                code: CardStatExport(
                    code=stat.code,
                    played=stat.played,
                    win=stat.win,
                    type=stat.type,
                    winrate=stat.getWinrate()
                )
                for code, stat in self.card_stats.items()
            }
        )
        """
        return export_model.model_dump_json(indent=4)
