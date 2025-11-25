export const TRIGGER_PRIORITY_DEFAULT_VALUE = 10;
export const CARD_PLAYED_PRIORITY_VALUE = 9

const DRAW = 11;

const RESOURCES = 8;
const RESOURCES_CONSUMPTION = 7;
const DRAW_DISCARD = 6;
const DISCARD_DRAW = 5;

export const TRIGGER_PRIORITY_MAP: Map<string, number> = new Map([
    //Draw cards
    ["19", DRAW], ["25", DRAW], ["37", DRAW], ["44", DRAW], ["48", DRAW], ["48B", DRAW],  ["D01", DRAW], ["D08", DRAW], ["FM4", DRAW], ["FM14", DRAW], 
    ["FM24", DRAW], ["FM121", DRAW], ["MC4", DRAW], 
    
    //Resource changes
    ["CF2", RESOURCES], ["F04", RESOURCES], ["61", RESOURCES],

    //Resource consumption
    ["19", RESOURCES_CONSUMPTION],

    //Draw then discard
    ["P16", DRAW_DISCARD],

    //Discard then draw
    ["40", DISCARD_DRAW],
]);
