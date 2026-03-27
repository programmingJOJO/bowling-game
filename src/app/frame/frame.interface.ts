import {RollData} from './roll.data';

export interface Frame extends RollData {
  id: number;
  dirty: boolean;
  isStrike: boolean;
  isSpare: boolean;
  result: number;
}
