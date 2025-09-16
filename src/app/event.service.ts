import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';  // Using RxJS Subject for event handling

@Injectable({
  providedIn: 'root'  // Make sure this service is available throughout your app
})
export class EventService {
  publish(arg0: string) {
    throw new Error('Method not implemented.');
  }

  private eventSubject = new Subject<any>();  // A Subject to handle events
  event$ = this.eventSubject.asObservable();  // Expose the observable to subscribe to

  constructor() {}

  emitEvent(eventData: any) {
    this.eventSubject.next(eventData);  // Emit event data
  }
}
