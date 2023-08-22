import { string, z } from 'zod';

const create = z.object({
  body: z.object({
    title: string({
      required_error: 'Title is Required',
    }),
    academicFacultyId: string({
      required_error: 'academicFacultyId is Required',
    }),
  }),
});
const update = z.object({
  body: z.object({
    title: string().optional(),
    academicFacultyId: string().optional(),
  }),
});

export const AcademicDepartmentValidation = { create, update };
