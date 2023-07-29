/*
  Warnings:

  - You are about to drop the column `styles` on the `Result` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Result" RENAME COLUMN "styles" TO "playstyles";
