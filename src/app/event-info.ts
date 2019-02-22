export interface EventInfo {
    id: number;
    startTime: Date;
    endTime: Date;
    rootAppointment?: {
      id: number,
      recurrenceException: string;
    };
}
