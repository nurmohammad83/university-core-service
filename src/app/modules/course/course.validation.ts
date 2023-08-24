import { z } from 'zod';

const create = z.object({
  title: z.string({
    required_error: 'title is required',
  }),
  code: z.string({
    required_error: 'code is required',
  }),
  credits: z.number({ required_error: 'credits is required' }).int(),
  preRequisiteCourses: z
    .array(
      z.object({
        courseId: z.string(),
      })
    )
    .optional(),
});

export const CourseValidation = { create };
