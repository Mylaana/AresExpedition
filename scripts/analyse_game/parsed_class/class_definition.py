
from pydantic import BaseModel
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
