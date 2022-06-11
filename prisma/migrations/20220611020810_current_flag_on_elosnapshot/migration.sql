-- AlterTable
ALTER TABLE "EloSnapshot" ADD COLUMN     "current" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
-- CUSTOMIZED so only one EloSnapshot per player and version can be current
CREATE UNIQUE INDEX "one_current_per_player_and_version" ON "EloSnapshot"("playerId", "versionId") WHERE "current" = true;
