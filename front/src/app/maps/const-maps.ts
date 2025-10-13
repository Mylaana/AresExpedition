import { GlobalParameterNameEnum } from "../enum/global.enum";
import { TagType } from "../types/global.type";

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
	MOON: 13
}
