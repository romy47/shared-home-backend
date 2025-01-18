-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_house_user_id_fkey";

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_house_user_id_fkey" FOREIGN KEY ("house_user_id") REFERENCES "HouseUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
