import { RedisClint } from '../../../shared/redis';
import { EVENT_STUDENT_CREATED } from './student.constans';
import { StudentService } from './student.service';

const initStudentEvents = () => {
  RedisClint.subscribe(EVENT_STUDENT_CREATED, async (e: string) => {
    const data = JSON.parse(e);
    await StudentService.createStudentFromEvent(data);
  });
};

export default initStudentEvents;
