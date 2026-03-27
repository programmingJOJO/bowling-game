import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {Frame} from '../frame/frame.interface';
import {RollData} from '../frame/roll.data';
import {MAX_FRAMES} from '../constants/game.contants';

type GameState = {
  frames: Frame[];
};

const initialState: GameState = {
  frames: Array.from({length: MAX_FRAMES}, (_, index: number) => ({
    id: index + 1,
    firstRoll: 0,
    secondRoll: 0,
    thirdRoll: 0,
    isStrike: false,
    isSpare: false,
    result: 0,
    dirty: false,
  })),
};

export const GameStore = signalStore(
  {providedIn: 'root'},
  withState(initialState),
  withMethods((store) => ({
    updateFrame(frameNumber: number, rollData: RollData) {
      const firstRoll = Number(rollData.firstRoll);
      const secondRoll = Number(rollData.secondRoll);
      const thirdRoll = Number(rollData.thirdRoll);
      const updatedFrame: Frame = {
        ...rollData,
        id: frameNumber,
        dirty: true,
        isStrike: firstRoll === 10,
        isSpare: firstRoll !== 10 && firstRoll + secondRoll === 10,
        result: firstRoll + secondRoll + thirdRoll,
      };
      patchState(store, ({frames}) => ({
        frames: frames.map((f: Frame) => f.id === frameNumber ? updatedFrame : f)
      }));
    },
  })))
