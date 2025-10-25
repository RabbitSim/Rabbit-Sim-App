import { Colony } from '../Colony'

export interface IAction {
    // perform the action; implementations apply state changes themselves.
    // allow async actions by returning Promise<void> if needed.
    takeAction(actor: Colony, target?: Colony, isDay?: boolean): void | Promise<void>;
}