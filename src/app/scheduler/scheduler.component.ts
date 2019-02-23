import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { SchedulerComponent } from 'sw-scheduler';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as _ from 'lodash';

import { EventService } from '../event.service';
import { SchedulerService } from './scheduler.service';
import { LoaderService } from '../loader.service';
import { Event } from '../event';
import { EventInfo } from '../event-info';
import { RecurringEventViewModel } from '../recurring-event-view-model';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.css'],
  providers: [SchedulerService]
})
export class AppSchedulerComponent implements OnInit, OnDestroy {
  private eventAddedSubscription: Subscription;
  private eventUpdatedSubscription: Subscription;
  private eventDeletedSubscription: Subscription;

  processing = false;
  editMode = true;
  ensureEventVisibleId: number;
  view = 'weekView';
  date = new Date();
  calendars = new Array<{name: string, events: Array<Event>}>();

  @ViewChild(SchedulerComponent) scheduler: SchedulerComponent;

  getNewEvent = (eventInfo: EventInfo): Event => {
    const event = {
      start: eventInfo.startTime,
      end: eventInfo.endTime
    };
    return event;
  }

  constructor(private schedulerSvc: SchedulerService, private eventSvc: EventService, private loaderSvc: LoaderService) { }

  ngOnInit() {
    this.eventAddedSubscription = this.schedulerSvc.eventAdded$.subscribe(event => {
      // add new event to the calendar
      let calendar: {name: string, events: Array<Event>};
      const calendars = this.calendars.filter(cal => cal.name.toUpperCase() === event.instructor.toUpperCase());
      if (calendars.length > 0) {
        calendar = calendars[0];
      } else {
        calendar = {name: event.instructor, events: []};
        this.calendars.push(calendar);
      }
      calendar.events.push(event);

      this.ensureEventVisibleId = event.id;

      // close the modal
      this.scheduler.closeSelectedEvent();
    });
    this.eventUpdatedSubscription = this.schedulerSvc.eventUpdated$.subscribe(event => {
      // close the modal
      this.scheduler.closeSelectedEvent();
    });
    this.eventDeletedSubscription = this.schedulerSvc.eventDeleted$.subscribe(id => {
      // removes the event from the calendar
      for (const calendar of this.calendars) {
        for (let i = 0; i < calendar.events.length; i++) {
          if (calendar.events[i].id === id) {
            calendar.events.splice(i, 1);
            break;
          }
        }
      }
      // close the modal
      this.scheduler.closeSelectedEvent();
    });

    // get all events
    this.loaderSvc.load(true);
    this.eventSvc.getEvents().subscribe(events => {
      for (const event of events) {
        let calendar: {name: string, events: Array<Event>};
        const calendars = this.calendars.filter(data => data.name === event.instructor);
        if (calendars.length > 0) {
          calendar = calendars[0];
        } else {
          calendar = {
            name: event.instructor,
            events: new Array<Event>()
          };
          this.calendars.push(calendar);
        }
        calendar.events.push(event);
      }
      this.ensureFirstEventVisible();
      this.loaderSvc.load(false);
    });
  }

  ngOnDestroy() {
    if (this.eventAddedSubscription) {
      this.eventAddedSubscription.unsubscribe();
    }
    if (this.eventUpdatedSubscription) {
      this.eventUpdatedSubscription.unsubscribe();
    }
    if (this.eventDeletedSubscription) {
      this.eventDeletedSubscription.unsubscribe();
    }
  }

  onAddEvent(event: Event) {

  }

  onSelectEvent(event: Event) {

  }

  onUpdateEvent(eventInfo: EventInfo) {
    // check if this is a recurring event
    if (eventInfo.rootAppointment && eventInfo.rootAppointment.id) {

      // updates the recurrence exception on the root appointment
      for (const calendar of this.calendars) {
        for (const ev of calendar.events) {
          if (ev.id === eventInfo.rootAppointment.id) {
            if (eventInfo.rootAppointment.recurrenceException) {
              if (ev.recurrenceException) {
                ev.recurrenceException += ',';
              } else {
                ev.recurrenceException = '';
              }
              ev.recurrenceException += eventInfo.rootAppointment.recurrenceException;
            }

            this.processing = true;
            this.eventSvc.updateEvent(ev)
                         .pipe(switchMap(() => {
                           const newEvent = _.cloneDeep(ev) as Event;
                           newEvent.id = null;
                           newEvent.start = eventInfo.startTime;
                           newEvent.end = eventInfo.endTime;
                           newEvent.recurrenceException = null;
                           newEvent.recurrencePattern = null;
                           return this.eventSvc.createEvent(newEvent);
                         }))
                         .subscribe(event => {
                           calendar.events.push(event);
                           this.ensureEventVisibleId = event.id;
                           this.processing = false;
                         }) ;
          }
        }
      }
      return;
    }

    let found = false;
    for (const calendar of this.calendars) {
      for (const ev of calendar.events) {
        if (ev.id === eventInfo.id) {
          found = true;

          // saves to the database
          const copy = _.cloneDeep(ev);
          copy.start = eventInfo.startTime;
          copy.end = eventInfo.endTime;

          this.processing = true;
          this.eventSvc.updateEvent(copy).subscribe(() => {
            // updates the event
            ev.start = eventInfo.startTime;
            ev.end = eventInfo.endTime;

            this.processing = false;
          });
          return;
        }
      }
    }

    if (!found) {
      // this.scheduler.render();
    }
  }

  onCloseEventModal() {

  }

  onViewChanged(args: any) {

  }

  onDateChanged(args: any) {

  }

  ensureFirstEventVisible() {
    let last: Event = null;

    let startTime = new Date();
    for (const calendar of this.calendars) {
      for (const event of calendar.events) {
        if (!last) {
          last = event;
          startTime.setHours(event.start.getHours(), event.start.getMinutes(), 0);
        } else {
          const start = new Date();
          start.setHours(event.start.getHours(), event.start.getMinutes(), 0);

          if (start < startTime) {
            startTime = start;
            last = event;
          }
        }
      }
    }

    if (last) {
      this.ensureEventVisibleId = last.id;
    } else {
      this.ensureEventVisibleId = null;
    }
  }
}
