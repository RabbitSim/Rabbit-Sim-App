import type {ActionRecord, ColonyState, GameLog, TurnRecord} from "./helperInterfaces.ts";


export class Logger {
    private log: GameLog = { initial: [], turns: [], deaths: [] };
    private currentTurn = 0;
    private initialRecorded = false;

    public recordInitial(colonies: ColonyState[]): void {
        if (this.initialRecorded) {
            throw new Error("Initial state already recorded");
        }
        this.log.initial = structuredClone(colonies);
        this.initialRecorded = true;
    }

    public recordTurn(actions: ActionRecord, colonies: ColonyState[]): void {
        if (!this.initialRecorded) {
            throw new Error("Initial state must be recorded before turns");
        }

        const turnRecord: TurnRecord = {
            turn: this.currentTurn,
            actions: structuredClone(actions),
            colonies: structuredClone(colonies),
        };

        this.log.turns.push(turnRecord);
        this.currentTurn += 1;
    }


    public recordDeath(turn: number, colonyName: string, lastAction: string, cause: string): void {
        if (!this.log.deaths) this.log.deaths = [];
        this.log.deaths.push({
        turn,
        colonyName,
        lastAction,
        cause,
        });
    }

    public getLog(): GameLog {
        return structuredClone(this.log);
    }

    public toJSON(): string {
        return JSON.stringify(this.log, null, 2);
    }

    public reset(): void {
        this.log = { initial: [], turns: [], deaths: []};
        this.currentTurn = 0;
        this.initialRecorded = false;
    }
}
