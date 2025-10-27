from enum import Enum


class GlobalParameterNameEnum(Enum):
    OCEAN = "OCEAN"
    INFRASTRUCTURE = "INFRASTRUCTURE"
    TEMPERATURE = "TEMPERATURE"
    OXYGEN = "OXYGEN"
    MOON = "MOON"


class PhaseNameEnum(Enum):
    DEVELOPMENT = "DEVELOPMENT"
    CONSTRUCTION = "CONSTRUCTION"
    ACTION = "ACTION"
    PRODUCTION = "PRODUCTION"
    RESEARCH = "RESEARCH"


class ResourceTypeEnum(Enum):
    megacredit = "megacredit"
    heat = "heat"
    plant = "plant"
    steel = "steel"
    titanium = "titanium"
    card = "card"


class CardTypeEnum(Enum):
    green = "greenProject"
    blue = "blueProject"
    red = "redProject"
    corp = "corporation"
