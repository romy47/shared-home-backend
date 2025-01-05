/*
  Warnings:

  - A unique constraint covering the columns `[house_id,user_id]` on the table `HouseUser` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "HouseUser_house_id_user_id_key" ON "HouseUser"("house_id", "user_id");
