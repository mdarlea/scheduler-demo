import {catchError, map, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { HttpErrorHandlerService, HandleError} from './http-error-handler.service';
import { Event } from './event';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class EventService {
  private handleError: HandleError;

  constructor(private http: HttpClient, exceptionSvc: HttpErrorHandlerService) {
    this.handleError = exceptionSvc.createHandleError('EventService');
  }

  getEvents(): Observable<Array<Event>> {
    const url = `api/events`;
    return this.http.get<Event[]>(url)
                    .pipe(tap(events => {
                      for (const event of events) {
                        this.setEventDateTime(event);
                      }
                    }), catchError(this.handleError('getEvents', new Array<Event>())));
  }

  getEvent(id: number): Observable<Event> {
    const url = `api/events/?id=${id}`;
    return this.http.get<Event>(url)
                    .pipe(tap(ev => { this.setEventDateTime(ev); }), catchError(this.handleError('getEvent', {} as Event)));
  }

  createEvent(event: Event): Observable<Event> {
    const url = `api/events`;
    return this.http.post<Event>(url, event, httpOptions)
                    .pipe(tap(ev => { this.setEventDateTime(ev); }), catchError(this.handleError('createEvent', event)));
  }

  updateEvent(event: Event): Observable<Event> {
    const url = `api/events`;
    return this.http.put<Event>(url, event, httpOptions)
                    .pipe(catchError(this.handleError('updateEvent', event)));
  }

  deleteEvent(id: number) {
    const url = `api/events/${id}`;
    return this.http.delete(url, httpOptions)
                    .pipe(catchError(this.handleError('deleteEvent')));
  }

  private setEventDateTime(ev: Event) {
    const start = new Date(ev.start);
    ev.start = start;
    const end = new Date(ev.end);
    ev.end = end;
  }
}
