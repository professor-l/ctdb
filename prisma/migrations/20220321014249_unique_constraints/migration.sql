/*
  Warnings:

  - You are about to drop the column `version` on the `EloSnapshot` table. All the data in the column will be lost.
  - You are about to drop the column `oragnizerId` on the `Event` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[playerId,matchId,versionId]` on the table `EloSnapshot` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,edition]` on the table `Event` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `versionId` to the `EloSnapshot` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MatchType" AS ENUM ('FRIENDLY', 'COMPETITIVE', 'CHAMPIONSHIP');

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_oragnizerId_fkey";

-- DropIndex
DROP INDEX "EloSnapshot_playerId_index_version_key";

-- AlterTable
ALTER TABLE "EloSnapshot" DROP COLUMN "version",
ADD COLUMN     "versionId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "oragnizerId",
ADD COLUMN     "organizerId" INTEGER;

-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "rom" "RomVersion" NOT NULL DEFAULT E'NTSC',
ADD COLUMN     "type" "MatchType" NOT NULL DEFAULT E'COMPETITIVE';

-- AlterTable
ALTER TABLE "Result" ADD COLUMN     "styles" "Playstyle"[];

-- CreateTable
CREATE TABLE "EloVersion" (
    "id" SERIAL NOT NULL,
    "version" TEXT NOT NULL,

    CONSTRAINT "EloVersion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EloSnapshot_playerId_matchId_versionId_key" ON "EloSnapshot"("playerId", "matchId", "versionId");

-- CreateIndex
CREATE UNIQUE INDEX "Event_name_edition_key" ON "Event"("name", "edition");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EloSnapshot" ADD CONSTRAINT "EloSnapshot_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "EloVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
