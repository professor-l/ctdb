/*
  Warnings:

  - You are about to drop the column `playstyle` on the `Player` table. All the data in the column will be lost.
  - Made the column `timestamp` on table `Match` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ROM_VERSION" AS ENUM ('NTSC', 'PAL', 'NTSC_CUSTOM', 'PAL_CUSTOM');

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_oragnizerId_fkey";

-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_userId_fkey";

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "edition" DROP NOT NULL,
ALTER COLUMN "oragnizerId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Match" ALTER COLUMN "timestamp" SET NOT NULL;

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "playstyle",
ADD COLUMN     "playstyles" "Playstyle"[],
ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "country" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "username" DROP NOT NULL,
ALTER COLUMN "salt" DROP NOT NULL,
ALTER COLUMN "hashed_pw" DROP NOT NULL;

-- CreateTable
CREATE TABLE "EloSnapshot" (
    "id" SERIAL NOT NULL,
    "playerId" INTEGER NOT NULL,
    "matchId" INTEGER NOT NULL,
    "index" INTEGER NOT NULL,
    "version" TEXT NOT NULL,
    "victor" BOOLEAN NOT NULL,
    "newElo" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "EloSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EloSnapshot_playerId_index_version_key" ON "EloSnapshot"("playerId", "index", "version");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_oragnizerId_fkey" FOREIGN KEY ("oragnizerId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EloSnapshot" ADD CONSTRAINT "EloSnapshot_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EloSnapshot" ADD CONSTRAINT "EloSnapshot_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
