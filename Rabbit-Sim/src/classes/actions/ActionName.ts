export const ActionName = {
    Attack: 0,
    Eat: 1,
    Sleep: 2,
    UPGRADE_AGRICULTURE: 3,
    UPGRADE_DEFENCE: 4,
    UPGRADE_OFFENSE: 5,
    HARVEST_FOOD: 6,
    MEDITATE: 7,
} as const;

export type ActionNameValue = (typeof ActionName)[keyof typeof ActionName];

export type ActionNameKey = keyof typeof ActionName;
