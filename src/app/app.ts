import {Component, inject, signal} from '@angular/core';
import {GameComponent} from './game/game.component';
import {LoggingService} from './services/logging.service';

@Component({
  selector: 'app-root',
  imports: [GameComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly loggingService = inject(LoggingService);
  protected readonly title = signal('bowling-game');
}
