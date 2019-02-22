import { InMemoryDbService } from 'angular-in-memory-web-api';

import {Event} from './event';

export class InMemEventService implements InMemoryDbService {
  createDb() {
    const events = new Array<Event>();

    let start = new Date();
    let end = new Date();
    start.setHours(10, 0, 0, 0);
    end.setHours(11, 0, 0, 0);
    events.push({
      id: 1,
      subject: 'IT Group Meeting',
      instructor: 'John Doe',
      location: 'Conference Room 1',
      start,
      end
    });

    start = new Date();
    end = new Date();
    start.setHours(12, 0, 0, 0);
    end.setHours(13, 0, 0, 0);
    events.push({
      id: 2,
      subject: 'Project Review Meeting',
      instructor: 'Laura Smith',
      location: 'Conference Room 2',
      start,
      end
    });

    start = new Date();
    end = new Date();
    start.setHours(13, 0, 0, 0);
    end.setHours(15, 0, 0, 0);
    events.push({
      id: 3,
      subject: 'Interview with Nancy',
      instructor: 'John Doe',
      location: 'Conference Room 2',
      start,
      end
    });

    start = new Date();
    end = new Date();
    start.setDate(start.getDate() + 1);
    start.setHours(8, 0, 0, 0);
    end.setDate(end.getDate() + 1);
    end.setHours(12, 0, 0, 0);
    events.push({
      id: 4,
      subject: 'Interview with Nancy',
      instructor: 'John Doe',
      location: 'Conference Room 3',
      start,
      end
    });

    return {events};
  }

  genId<T extends { id: number }>(collection: T[], collectionName: string): number {
    return collection.length > 0 ? Math.max(...collection.map(item => item.id)) + 1 : 1;
  }
}
