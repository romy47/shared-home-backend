/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "TaskSplitStatus" ADD VALUE 'IN_PROGRESS';

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
