/*
  Warnings:

  - You are about to drop the column `reatedAt` on the `offered_courses` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "offered_courses" DROP COLUMN "reatedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
