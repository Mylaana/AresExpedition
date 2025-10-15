import { GlobalParameterNameEnum } from "../enum/global.enum";
import { GameContentName, TagType } from "../types/global.type";

export const TAGS_ID_TO_NAME: Record<string,  TagType> = {
    '0':  'building',
    '1':  'space',
    '2':  'science',
    '3':  'power',
    '4':  'earth',
    '5':  'jovian',
    '6':  'plant',
    '7':  'animal',
    '8':  'microbe',
    '9':  'event',
    '11': 'moon',

    '-1':  'none',
    '99': 'omni'
}
export const GLOBAL_PARAMETER_MAX_STEP: Record<GlobalParameterNameEnum, number> = {
	INFRASTRUCTURE: 15,
	OCEAN: 9,
	OXYGEN: 15,
	TEMPERATURE: 15,
	MOON: 17
}
export const GAME_OPTIONS_TEMPLATE: Record<GameContentName, boolean> = {
	'expansionBalancedCards': false,
	'expansionDevFanMade': false,
	'expansionMoon': false,
	'expansionFoundations': false,
	'expansionDiscovery': false,
	'expansionPromo': false,
	'modeAdditionalAwards': false,
	'modeDeadHand': false,
	'modeInfrastructureMandatory': false,
	'modeInitialDraft': true,
	'modeMerger': false,
	'modeStandardProjectPhaseUpgrade': false,
	'modeMoonMandatory': false
}
