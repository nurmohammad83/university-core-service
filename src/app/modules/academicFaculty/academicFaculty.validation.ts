import { string, z } from 'zod';

const create = z.object({
  body: z.object({
    title: string({
      required_error: 'Title is Required',
    }),
  }),
});
const update = z.object({
  body: z.object({
    title: string().optional(),
  }),
});

export const AcademicFacultyValidation = { create, update };
