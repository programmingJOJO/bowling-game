import {computed, Injectable, signal} from '@angular/core';

@Injectable({providedIn: 'root'})
export class LoggingService {
  private readonly activeLogging = signal(false)
  readonly loggingEnabled = computed(() => this.activeLogging());

  toggleLogging() {
    this.activeLogging.set(!this.activeLogging());
  }
}
