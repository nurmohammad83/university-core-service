import { RedisClint } from '../../../shared/redis';
import {
  EVENT_FACULTY_CREATED,
  EVENT_FACULTY_UPDATED,
} from './faculty.constans';
import { FacultyCreatedEvent } from './faculty.interface';
import { FacultyService } from './faculty.service';

const initFacultyEvents = () => {
  RedisClint.subscribe(EVENT_FACULTY_CREATED, async (e: string) => {
    const data: FacultyCreatedEvent = JSON.parse(e);

    await FacultyService.createFacultyFromEvent(data);
  });

  RedisClint.subscribe(EVENT_FACULTY_UPDATED, async (e: string) => {
    const data = JSON.parse(e);
    console.log(data);
    await FacultyService.updateFacultyFromEvent(data);
  });
};

export default initFacultyEvents;
