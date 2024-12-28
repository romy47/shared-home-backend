/*
  Warnings:

  - Changed the type of `created_by` on the `House` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "House" DROP COLUMN "created_by",
ADD COLUMN     "created_by" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "House" ADD CONSTRAINT "House_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
