export const ColonyMath = {
    //multipliers for each upgrade level
    agricultureMultiplier(level: number): number {
        const base = 1.04;
        const milestones: Record<number, number> = {
            3: 1.01, 5: 1.06, 7: 1.03, 9: 1.06,
            11: 1.05, 13: 1.1, 15: 1.3, 17: 1.15, 19: 1.15
        };

        let mult = 1.05;

        for (let i = 2; i <= level; i++) {
            mult *= base;
            if (milestones[i]) mult *= milestones[i];
        }

        return mult;
    },

    offenceMultiplier(level: number): number {
        const base = 1.04;
        const milestones: Record<number, number> = {3:1.03,5:1.06,7:1.05,9:1.05,11:1.05,13:1.05,15:1.16,17:1.14,19:1.16};
        let mult = 1;
        for (let i = 2; i <= level; i++) {
            mult *= base;
            if (milestones[i]) mult *= milestones[i];
        }
        return mult;
    },

    defenceMultiplier(level: number): number {
        const base = 1.035;
        const milestones: Record<number, number> = {3:1.02,5:1.05,7:1.04,9:1.05,11:1.04,13:1.06,15:1.12,17:1.12,19:1.14};
        let mult = 1;
        for (let i = 2; i <= level; i++) {
            mult *= base;
            if (milestones[i]) mult *= milestones[i];
        }
        return mult;
    },

    // exponential cost growth
    upgradeCost(base: number, rate: number, level: number): number {
        return Math.round(base * Math.pow(rate, level - 1));
    },

    //logistic growth (soft cap on population)
    populationGrowth(pop: number, r: number, K: number): number {
        return r * pop * (1 - pop / K);
    },

    //clamp values safely
    clamp(value: number, min: number, max: number): number {
        return Math.min(max, Math.max(min, value));
    }
};
