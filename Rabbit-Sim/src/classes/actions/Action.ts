import { Colony } from '../Colony'

export interface Action {
    takeAction(actor: Colony, context?: any): number;
}