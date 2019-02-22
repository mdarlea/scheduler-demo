import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

import { SchedulerService } from '../scheduler/scheduler.service';
import { EventService } from '../event.service';
import { Event } from '../event';
import { RecurringEventViewModel } from '../recurring-event-view-model';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css']
})
export class EditEventComponent implements OnInit, OnChanges {
  eventCopy = new Event();
  recurring = new RecurringEventViewModel();
  processing = false;

  @Input() event: Event;

  constructor(private schedulerSvc: SchedulerService, private eventSvc: EventService) {

   }

  ngOnChanges(changes: any): void {
    if (changes && 'event' in changes) {
      const value = changes.event.currentValue as Event;
      if (value) {
        this.eventCopy = _.cloneDeep(value);
        this.recurring = RecurringEventViewModel.parse(value.recurrencePattern);
      } else {
        this.eventCopy = new Event();
        this.recurring = new RecurringEventViewModel();
      }
    }
  }

  ngOnInit() {
  }

  onSave() {
    // check if this is a recurring event
    if (this.recurring.recurring) {
      this.eventCopy.recurrencePattern = this.recurring.toString();
    } else {
      this.eventCopy.recurrencePattern = null;
    }

    let eventAdded = false;
    let observable: Observable<Event>;

    // add or update event
    if (!this.eventCopy.id) {
      observable = this.eventSvc.createEvent(this.eventCopy);
      eventAdded = true;
    } else {
      observable = this.eventSvc.updateEvent(this.eventCopy);
    }

    this.processing = true;
    observable.subscribe(event => {
      if (eventAdded) {
        this.eventCopy = event;
      }
      Object.assign(this.event, _.cloneDeep(this.eventCopy));

      this.processing = false;

      // notifies the subscribers
      if (eventAdded) {
        this.schedulerSvc.eventAdded(this.event);
      } else {
        this.schedulerSvc.eventUpdated(this.event);
      }
    });
  }

  delete() {
    if (!this.event.id) { return; }

    // deletes this event
    this.processing = true;
    this.eventSvc.deleteEvent(this.event.id).subscribe(value => {
      this.processing = false;
      this.schedulerSvc.eventDeleted(this.event.id);
    });
  }
}
