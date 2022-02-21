/*
  Warnings:

  - You are about to drop the column `salt` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "RomVersion" AS ENUM ('NTSC', 'PAL', 'NTSC_CUSTOM', 'PAL_CUSTOM');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "salt";

-- DropEnum
DROP TYPE "ROM_VERSION";
