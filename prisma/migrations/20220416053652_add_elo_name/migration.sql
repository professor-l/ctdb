/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Event` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[eloName]` on the table `Player` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `eloName` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `Player` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Event_name_edition_key";

-- DropIndex
DROP INDEX "Player_name_key";

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "edition" SET DATA TYPE VARCHAR(256);

-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "eloName" VARCHAR(64) NOT NULL,
ALTER COLUMN "name" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Event_name_key" ON "Event"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Player_eloName_key" ON "Player"("eloName");
