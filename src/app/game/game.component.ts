import {Component, inject} from '@angular/core';
import {FrameComponent} from '../frame/frame.component';
import {GameStore} from './game.store';

@Component({
  selector: 'app-game',
  imports: [
    FrameComponent
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent {
  readonly gameStore = inject(GameStore);
}
