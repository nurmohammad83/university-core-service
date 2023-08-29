/*
  Warnings:

  - You are about to drop the column `createAt` on the `semester_registration` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `semester_registration` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `semester_registration` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "semester_registration" DROP COLUMN "createAt",
DROP COLUMN "updateAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
