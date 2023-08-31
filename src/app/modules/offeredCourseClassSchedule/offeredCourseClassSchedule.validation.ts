import { z } from 'zod';

const create = z.object({
  body: z.object({
    startTime: z.string({
      required_error: 'startTime is required',
    }),
    endTime: z.string({
      required_error: 'End time is required',
    }),
    dayOfWeek: z.string({
      required_error: 'dayOfWeek is required',
    }),
    offeredCoursesSectionId: z.string({
      required_error: 'offeredCoursesSectionId is required',
    }),
    semesterRegistrationId: z.string({
      required_error: 'semesterRegistrationId is required',
    }),
    roomId: z.string({
      required_error: 'roomId is required',
    }),
    facultyId: z.string({
      required_error: 'facultyId is required',
    }),
  }),
});

export const OfferedCourseClassScheduleValidation = {
  create,
};
