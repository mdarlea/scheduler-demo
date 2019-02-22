import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Event } from '../event';

@Injectable()
export class SchedulerService {
  private eventAddedSource = new Subject<Event>();
  private eventUpdatedSource = new Subject<Event>();
  private eventDeletedSource = new Subject<number>();

  eventAdded$ = this.eventAddedSource.asObservable();
  eventUpdated$ = this.eventUpdatedSource.asObservable();
  eventDeleted$ = this.eventDeletedSource.asObservable();

  eventAdded(event: Event) {
    this.eventAddedSource.next(event);
  }

  eventUpdated(event: Event) {
    this.eventUpdatedSource.next(event);
  }

  eventDeleted(id: number) {
    this.eventDeletedSource.next(id);
  }
}
