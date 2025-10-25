import { Colony } from '../Colony'

export interface Action {
    // perform the action; implementations apply state changes themselves.
    // allow async actions by returning Promise<void> if needed.
    takeAction(actor: Colony, target?: Colony, context?: any): void | Promise<void>;
}