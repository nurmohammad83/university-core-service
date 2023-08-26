export type ICourseData = {
  title: string;
  code: string;
  credits: number;
  preRequisiteCourses: IPrerequisiteRequest[];
};
export type IPrerequisiteRequest = {
  courseId: string;
  isDelete?: null;
};
export type ICourseFilter = {
  searchTerm?: string | undefined;
};
