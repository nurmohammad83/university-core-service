export const offeredCourseClassScheduleSearchableFields = ['dayOfWeek'];
export const offeredCourseClassScheduleFilterableFields = [
  'searchTerm',
  'dayOfWeek',
  'offeredCoursesSectionId',
  'semesterRegistrationId',
  'roomId',
  'facultyId',
];
export const offeredCourseClassScheduleRelationalFields = [
  'offeredCoursesSectionId',
  'semesterRegistrationId',
  'roomId',
  'facultyId',
];

export const offeredCourseClassScheduleRelationalFieldsMapper: {
  [key: string]: string;
} = {
  offeredCoursesSectionId: 'offeredCoursesSection',
  semesterRegistrationId: 'semesterRegistration',
  roomId: 'room',
  facultyId: 'faculty',
};
