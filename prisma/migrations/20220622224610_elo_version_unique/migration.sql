/*
  Warnings:

  - A unique constraint covering the columns `[version]` on the table `EloVersion` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "EloVersion_version_key" ON "EloVersion"("version");
