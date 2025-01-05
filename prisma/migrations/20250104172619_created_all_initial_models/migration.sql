/*
  Warnings:

  - You are about to drop the column `profile_img` on the `House` table. All the data in the column will be lost.
  - The `profile_img` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ExpenseSplitStatus" AS ENUM ('OWED', 'SETTLED');

-- CreateEnum
CREATE TYPE "TaskSplitStatus" AS ENUM ('PENDING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');

-- AlterTable
ALTER TABLE "House" DROP COLUMN "profile_img",
ADD COLUMN     "house_img" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "super_admin" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "profile_img",
ADD COLUMN     "profile_img" INTEGER;

-- CreateTable
CREATE TABLE "ImageLibrary" (
    "id" SERIAL NOT NULL,
    "icon_name" TEXT NOT NULL,
    "image_path" TEXT NOT NULL,

    CONSTRAINT "ImageLibrary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExpenseCategory" (
    "id" SERIAL NOT NULL,
    "created_by" INTEGER NOT NULL,
    "house_id" INTEGER NOT NULL,
    "image_id" INTEGER,
    "title" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExpenseCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" SERIAL NOT NULL,
    "house_user_id" INTEGER NOT NULL,
    "house_id" INTEGER NOT NULL,
    "expense_category_id" INTEGER NOT NULL,
    "recurring_expense_id" INTEGER,
    "currency" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecurringExpense" (
    "id" SERIAL NOT NULL,
    "house_user_id" INTEGER NOT NULL,
    "house_id" INTEGER NOT NULL,
    "expense_category_id" INTEGER NOT NULL,
    "schedule_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecurringExpense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Schedule" (
    "id" SERIAL NOT NULL,
    "frequency" INTEGER NOT NULL,
    "multiplier" INTEGER NOT NULL,
    "offset" INTEGER NOT NULL,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecurringTask" (
    "id" SERIAL NOT NULL,
    "house_user_id" INTEGER NOT NULL,
    "house_id" INTEGER NOT NULL,
    "task_category_id" INTEGER NOT NULL,
    "schedule_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "due_date" TIMESTAMP(3),
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecurringTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskCategory" (
    "id" SERIAL NOT NULL,
    "house_user_id" INTEGER NOT NULL,
    "house_id" INTEGER NOT NULL,
    "image_id" INTEGER,
    "title" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaskCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExpenseSplit" (
    "id" SERIAL NOT NULL,
    "expense_id" INTEGER NOT NULL,
    "house_user_id" INTEGER NOT NULL,
    "recurring_expense_id" INTEGER,
    "amount" DECIMAL(65,30) NOT NULL,
    "amount_due" DECIMAL(65,30) NOT NULL,
    "status" "ExpenseSplitStatus" NOT NULL DEFAULT 'OWED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExpenseSplit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskSplit" (
    "id" SERIAL NOT NULL,
    "task_id" INTEGER NOT NULL,
    "house_user_id" INTEGER NOT NULL,
    "recurring_task_id" INTEGER,
    "status" "TaskSplitStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaskSplit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "house_user_id" INTEGER NOT NULL,
    "house_id" INTEGER NOT NULL,
    "task_category_id" INTEGER NOT NULL,
    "recurring_task_id" INTEGER,
    "title" TEXT NOT NULL,
    "due_date" TIMESTAMP(3),
    "status" "TaskStatus" NOT NULL DEFAULT 'PENDING',
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "House" ADD CONSTRAINT "House_house_img_fkey" FOREIGN KEY ("house_img") REFERENCES "ImageLibrary"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_profile_img_fkey" FOREIGN KEY ("profile_img") REFERENCES "ImageLibrary"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpenseCategory" ADD CONSTRAINT "ExpenseCategory_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "HouseUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpenseCategory" ADD CONSTRAINT "ExpenseCategory_house_id_fkey" FOREIGN KEY ("house_id") REFERENCES "House"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpenseCategory" ADD CONSTRAINT "ExpenseCategory_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "ImageLibrary"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_house_user_id_fkey" FOREIGN KEY ("house_user_id") REFERENCES "HouseUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_house_id_fkey" FOREIGN KEY ("house_id") REFERENCES "House"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_expense_category_id_fkey" FOREIGN KEY ("expense_category_id") REFERENCES "ExpenseCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_recurring_expense_id_fkey" FOREIGN KEY ("recurring_expense_id") REFERENCES "RecurringExpense"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurringExpense" ADD CONSTRAINT "RecurringExpense_house_user_id_fkey" FOREIGN KEY ("house_user_id") REFERENCES "HouseUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurringExpense" ADD CONSTRAINT "RecurringExpense_house_id_fkey" FOREIGN KEY ("house_id") REFERENCES "House"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurringExpense" ADD CONSTRAINT "RecurringExpense_expense_category_id_fkey" FOREIGN KEY ("expense_category_id") REFERENCES "ExpenseCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurringExpense" ADD CONSTRAINT "RecurringExpense_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "Schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurringTask" ADD CONSTRAINT "RecurringTask_house_user_id_fkey" FOREIGN KEY ("house_user_id") REFERENCES "HouseUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurringTask" ADD CONSTRAINT "RecurringTask_house_id_fkey" FOREIGN KEY ("house_id") REFERENCES "House"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurringTask" ADD CONSTRAINT "RecurringTask_task_category_id_fkey" FOREIGN KEY ("task_category_id") REFERENCES "TaskCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurringTask" ADD CONSTRAINT "RecurringTask_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "Schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskCategory" ADD CONSTRAINT "TaskCategory_house_user_id_fkey" FOREIGN KEY ("house_user_id") REFERENCES "HouseUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskCategory" ADD CONSTRAINT "TaskCategory_house_id_fkey" FOREIGN KEY ("house_id") REFERENCES "House"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskCategory" ADD CONSTRAINT "TaskCategory_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "ImageLibrary"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpenseSplit" ADD CONSTRAINT "ExpenseSplit_expense_id_fkey" FOREIGN KEY ("expense_id") REFERENCES "Expense"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpenseSplit" ADD CONSTRAINT "ExpenseSplit_house_user_id_fkey" FOREIGN KEY ("house_user_id") REFERENCES "HouseUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpenseSplit" ADD CONSTRAINT "ExpenseSplit_recurring_expense_id_fkey" FOREIGN KEY ("recurring_expense_id") REFERENCES "RecurringExpense"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskSplit" ADD CONSTRAINT "TaskSplit_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskSplit" ADD CONSTRAINT "TaskSplit_house_user_id_fkey" FOREIGN KEY ("house_user_id") REFERENCES "HouseUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskSplit" ADD CONSTRAINT "TaskSplit_recurring_task_id_fkey" FOREIGN KEY ("recurring_task_id") REFERENCES "RecurringTask"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_house_user_id_fkey" FOREIGN KEY ("house_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_house_id_fkey" FOREIGN KEY ("house_id") REFERENCES "House"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_task_category_id_fkey" FOREIGN KEY ("task_category_id") REFERENCES "TaskCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_recurring_task_id_fkey" FOREIGN KEY ("recurring_task_id") REFERENCES "RecurringTask"("id") ON DELETE SET NULL ON UPDATE CASCADE;
