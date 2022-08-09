-- CreateTable
CREATE TABLE "ComputedElo" (
    "playerId" TEXT NOT NULL,
    "versionId" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "elo" DOUBLE PRECISION NOT NULL,
    "winCount" INTEGER NOT NULL,
    "lossCount" INTEGER NOT NULL,
    "highestElo" DOUBLE PRECISION NOT NULL,
    "lastMatch" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ComputedElo_pkey" PRIMARY KEY ("playerId","versionId")
);

-- AddForeignKey
ALTER TABLE "ComputedElo" ADD CONSTRAINT "ComputedElo_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComputedElo" ADD CONSTRAINT "ComputedElo_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "EloVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
