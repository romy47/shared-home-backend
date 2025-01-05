/*
  Warnings:

  - Made the column `deleted` on table `House` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "House" ALTER COLUMN "deleted" SET NOT NULL;
