export class Event {
  id?: number;
  subject?: string;
  description?: string;
  location?: string;
  instructor?: string;
  start: Date;
  end: Date;
  recurrencePattern?: string;
  recurrenceException?: string;
}
