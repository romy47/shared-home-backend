-- CreateEnum
CREATE TYPE "HouseMemberApprovalState" AS ENUM ('pending', 'approved', 'rejected');

-- CreateTable
CREATE TABLE "HouseMemberRequest" (
    "id" SERIAL NOT NULL,
    "house_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "house_user_ref_id" INTEGER NOT NULL,
    "state" "HouseMemberApprovalState" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HouseMemberRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HouseMemberRequest_house_id_idx" ON "HouseMemberRequest"("house_id");

-- CreateIndex
CREATE INDEX "HouseMemberRequest_user_id_idx" ON "HouseMemberRequest"("user_id");

-- CreateIndex
CREATE INDEX "HouseMemberRequest_house_user_ref_id_idx" ON "HouseMemberRequest"("house_user_ref_id");

-- AddForeignKey
ALTER TABLE "HouseMemberRequest" ADD CONSTRAINT "HouseMemberRequest_house_id_fkey" FOREIGN KEY ("house_id") REFERENCES "House"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HouseMemberRequest" ADD CONSTRAINT "HouseMemberRequest_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HouseMemberRequest" ADD CONSTRAINT "HouseMemberRequest_house_user_ref_id_fkey" FOREIGN KEY ("house_user_ref_id") REFERENCES "HouseUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
