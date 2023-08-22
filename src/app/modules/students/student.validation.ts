import { string, z } from 'zod';

const create = z.object({
  body: z.object({
    studentId: string({
      required_error: 'studentId is Required',
    }),
    firstName: string({
      required_error: 'firstName is Required',
    }),
    lastName: string({
      required_error: 'lastName is Required',
    }),
    middleName: string({
      required_error: 'middleName is Required',
    }).optional(),
    profileImage: string({
      required_error: 'profileImage is Required',
    }),
    email: string({
      required_error: 'email is Required',
    }),
    contactNo: string({
      required_error: 'contactNo is Required',
    }),
    gender: string({
      required_error: 'gender is Required',
    }),
    bloodGroup: string({
      required_error: 'bloodGroup is Required',
    }),
    academicSemesterId: string({
      required_error: 'academicSemesterId is Required',
    }),
    academicDepartmentId: string({
      required_error: 'academicDepartmentId is Required',
    }),
    academicFacultyId: string({
      required_error: 'academicFacultyId is Required',
    }),
  }),
});
const update = z.object({
  body: z.object({
    studentId: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    middleName: z.string().optional(),
    profileImage: z.string().optional(),
    email: z.string().optional(),
    contactNo: z.string().optional(),
    gender: z.string().optional(),
    bloodGroup: z.string().optional(),
    academicSemesterId: z.string().optional(),
    academicDepartmentId: z.string().optional(),
    academicFacultyId: z.string().optional(),
  }),
});

export const StudentValidation = { create, update };
