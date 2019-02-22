import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { SchedulerModule} from 'sw-scheduler';

import { AppComponent } from './app.component';
import { EditEventComponent } from './edit-event/edit-event.component';
import { AppSchedulerComponent } from './scheduler/scheduler.component';
import { RecurringEventComponent } from './recurring-event/recurring-event.component';
import { TimePickerComponent} from './time-picker/time-picker.component';
import { LimitToPipe } from './time-picker/limit-to.pipe';
import { DateFormatPipe } from './time-picker/date-format.pipe';
import { LoaderComponent} from './loader/loader.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { InMemEventService } from './in-mem-event-service';
import { HttpErrorHandlerService } from './http-error-handler.service';
import { MessageService } from './message.service';
import { EventService } from './event.service';
import { LoaderService } from './loader.service';

@NgModule({
  declarations: [
    AppComponent,
    EditEventComponent,
    AppSchedulerComponent,
    RecurringEventComponent,
    LimitToPipe,
    DateFormatPipe,
    TimePickerComponent,
    LoaderComponent,
    SpinnerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(InMemEventService, {delay: 1500, dataEncapsulation: false}),
    SchedulerModule
  ],
  providers: [
    HttpErrorHandlerService,
    MessageService,
    EventService,
    LoaderService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
