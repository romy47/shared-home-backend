-- CreateTable
CREATE TABLE "House" (
    "id" SERIAL NOT NULL,
    "created_by" INTEGER NOT NULL,
    "title" TEXT,
    "profile_img" TEXT,
    "deleted" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "House_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "email" TEXT,
    "auth_id" TEXT,
    "birthday" TIMESTAMP(3),
    "profile_img" TEXT,
    "deleted" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "role" TEXT,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HouseUser" (
    "id" SERIAL NOT NULL,
    "house_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "role_id" INTEGER NOT NULL,

    CONSTRAINT "HouseUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HouseUser_house_id_idx" ON "HouseUser"("house_id");

-- CreateIndex
CREATE INDEX "HouseUser_user_id_idx" ON "HouseUser"("user_id");

-- CreateIndex
CREATE INDEX "HouseUser_role_id_idx" ON "HouseUser"("role_id");

-- AddForeignKey
ALTER TABLE "HouseUser" ADD CONSTRAINT "HouseUser_house_id_fkey" FOREIGN KEY ("house_id") REFERENCES "House"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HouseUser" ADD CONSTRAINT "HouseUser_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HouseUser" ADD CONSTRAINT "HouseUser_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
