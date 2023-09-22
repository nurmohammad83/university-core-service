import initFacultyEvents from '../modules/faculty/faculty.event';
import initStudentEvents from '../modules/students/student.event';

const subscribeToEvents = () => {
  initStudentEvents();
  initFacultyEvents();
};

export default subscribeToEvents;
