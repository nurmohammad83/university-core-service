/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `faculties` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "faculties" ALTER COLUMN "middleName" SET DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "faculties_email_key" ON "faculties"("email");
