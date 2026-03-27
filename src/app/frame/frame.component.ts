import {Component, computed, effect, inject, input, InputSignal, signal, Signal, WritableSignal} from '@angular/core';
import {RollData} from './roll.data';
import {disabled, form, FormField, required} from '@angular/forms/signals';
import {ReactiveFormsModule} from '@angular/forms';
import {LoggingService} from '../services/logging.service';
import {Frame} from './frame.interface';
import {GameStore} from '../game/game.store';
import {MAX_FRAMES} from '../constants/game.contants';

@Component({
  selector: 'app-frame',
  imports: [
    FormField,
    ReactiveFormsModule
  ],
  templateUrl: './frame.component.html',
  styleUrl: './frame.component.scss',
})
export class FrameComponent {
  static readonly MAX_PINS: number = 10;
  readonly loggingService: LoggingService = inject(LoggingService);
  readonly gameStore = inject(GameStore);
  readonly frame: InputSignal<Frame> = input.required<Frame>();
  readonly rollModel: WritableSignal<RollData> = signal<RollData>({
    firstRoll: 0,
    secondRoll: 0,
    thirdRoll: 0,
  });

  readonly rollForm = form(this.rollModel, (schemaPath) => {
    required(schemaPath.firstRoll);
    required(schemaPath.secondRoll, {
      when: ({valueOf}) => valueOf(schemaPath.firstRoll) <= FrameComponent.MAX_PINS,
    });
    disabled(schemaPath.firstRoll, ({valueOf}) => {
      const prevFrame = this.gameStore.frames()[this.frame().id - 2];
      return !!prevFrame && !prevFrame.dirty;
    });
    disabled(schemaPath.secondRoll, ({valueOf}) => !valueOf(schemaPath.firstRoll) || Number(valueOf(schemaPath.firstRoll)) === FrameComponent.MAX_PINS);
    disabled(schemaPath.thirdRoll, ({valueOf}) => {
      return !valueOf(schemaPath.firstRoll) && Number(valueOf(schemaPath.firstRoll)) !== FrameComponent.MAX_PINS ||
        !valueOf(schemaPath.firstRoll) && !valueOf(schemaPath.secondRoll) && Number(valueOf(schemaPath.firstRoll)) + Number(valueOf(schemaPath.firstRoll)) !== FrameComponent.MAX_PINS;
    });
  });

  readonly firstRollOptions: {
    label: number | string,
    value: number
  }[] = Array.from({length: FrameComponent.MAX_PINS + 1}, (_, i) => ({
    label: i === FrameComponent.MAX_PINS ? 'Strike' : i,
    value: i
  }));

  readonly secondRollOptions: Signal<{
    label: number | string,
    value: number
  }[]> = computed(() => {
    const firstRoll = this.rollForm.firstRoll().value();
    const maxSecondRoll = FrameComponent.MAX_PINS - firstRoll;
    return Array.from({length: maxSecondRoll + 1}, (_, i) => ({
      label: i === maxSecondRoll ? 'Spare' : i,
      value: i
    }));
  });

  readonly result: Signal<number> = computed(() => {
    if (!this.rollForm().dirty()) {
      return 0;
    }
    const firstRoll = Number(this.rollForm.firstRoll().value());
    const secondRoll = Number(this.rollForm.secondRoll().value());
    const thirdRoll = Number(this.rollForm.thirdRoll().value());
    const resultFromPreviousFrames = this.getResultsFromPrevFrames();
    return resultFromPreviousFrames + firstRoll + secondRoll + thirdRoll;
  });

  readonly isLastFrame: Signal<boolean> = computed(() => this.frame().id === MAX_FRAMES);

  readonly isSpare: Signal<boolean> = computed(() => {
    const secondRoll = Number(this.rollForm.secondRoll().value());
    return (secondRoll && secondRoll > 0) ? Number(this.rollForm.firstRoll().value()) + secondRoll === FrameComponent.MAX_PINS : false;
  });

  readonly isStrike: Signal<boolean> = computed(() => Number(this.rollForm.firstRoll().value()) === FrameComponent.MAX_PINS);

  constructor() {
    effect(() => {
      const frame = this.frame();
      if (frame && !this.rollForm.firstRoll().dirty()) {
        this.rollModel.set({
          firstRoll: frame.firstRoll,
          secondRoll: frame.secondRoll,
          thirdRoll: frame.thirdRoll,
        });
      }
    });
    effect(() => {
      const firstRoll = this.rollForm.firstRoll().value();
      this.rollForm.secondRoll().reset(0);
      this.rollForm.thirdRoll().reset(0);
    });
  }

  selectRoll() {
    this.gameStore.updateFrame(this.frame().id, this.rollForm().value())
  }

  private getResultsFromPrevFrames(): number {
    return (this.gameStore.frames()
      .slice(0, this.frame().id - 1)
      .map(frame => frame.result))
      .reduce((acc, val) => acc + val, 0);
  }
}
