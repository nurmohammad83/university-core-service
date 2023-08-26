import { z } from 'zod';

const create = z.object({
  body: z.object({
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
  }),
});
const update = z.object({
  body: z.object({
    title: z.string().optional(),
    code: z.string().optional(),
    credits: z.number().int().optional(),
    preRequisiteCourses: z
      .array(
        z
          .object({
            courseId: z.string().optional(),
          })
          .optional()
      )
      .optional(),
  }),
});

export const CourseValidation = { create, update };
