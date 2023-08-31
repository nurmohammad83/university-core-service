/*
  Warnings:

  - You are about to drop the `StudentSemesterRegistration` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "StudentSemesterRegistration" DROP CONSTRAINT "StudentSemesterRegistration_semesterRegistrationId_fkey";

-- DropForeignKey
ALTER TABLE "StudentSemesterRegistration" DROP CONSTRAINT "StudentSemesterRegistration_studentId_fkey";

-- DropTable
DROP TABLE "StudentSemesterRegistration";

-- CreateTable
CREATE TABLE "student-semester-registartion" (
    "id" TEXT NOT NULL,
    "isConfirmed" BOOLEAN DEFAULT false,
    "totalCreditsTaken" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "studentId" TEXT NOT NULL,
    "semesterRegistrationId" TEXT NOT NULL,

    CONSTRAINT "student-semester-registartion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "student-semester-registartion" ADD CONSTRAINT "student-semester-registartion_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student-semester-registartion" ADD CONSTRAINT "student-semester-registartion_semesterRegistrationId_fkey" FOREIGN KEY ("semesterRegistrationId") REFERENCES "semester_registration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
