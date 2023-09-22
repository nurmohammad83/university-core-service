export const academicSemesterSearchableField = [
  'title',
  'code',
  'startMonth',
  'endMonth',
];

export const academicSemesterFilterableFields = [
  'searchTerm',
  'title',
  'code',
  'endMonth',
  'startMonth',
];
export const academicSemesterTitleCodeMapper: {
  [key: string]: string;
} = {
  Autumn: '01',
  Summer: '02',
  Fall: '03',
};

export const academicSemesterTitles: string[] = ['Autum', 'Summer', 'Fall'];
export const EVENT_ACADEMIC_SEMESTER_CREATED = 'academic-semester.create';
export const EVENT_ACADEMIC_SEMESTER_UPDATE = 'academic-semester.update';
export const EVENT_ACADEMIC_SEMESTER_DELETE = 'academic-semester.delete';
