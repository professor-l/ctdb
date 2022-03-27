/*
  Warnings:

  - You are about to drop the `_EventToPlayer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_EventToPlayer" DROP CONSTRAINT "_EventToPlayer_A_fkey";

-- DropForeignKey
ALTER TABLE "_EventToPlayer" DROP CONSTRAINT "_EventToPlayer_B_fkey";

-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "pronouns" "Pronoun"[];

-- DropTable
DROP TABLE "_EventToPlayer";
