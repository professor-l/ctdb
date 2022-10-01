/*
  Warnings:

  - The primary key for the `ComputedElo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[playerId,versionId]` on the table `ComputedElo` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `ComputedElo` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "ComputedElo" DROP CONSTRAINT "ComputedElo_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "ComputedElo_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "ComputedElo_playerId_versionId_key" ON "ComputedElo"("playerId", "versionId");
