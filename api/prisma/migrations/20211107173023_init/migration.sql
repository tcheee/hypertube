/*
  Warnings:

  - You are about to drop the column `MovieId` on the `MoviesSeen` table. All the data in the column will be lost.
  - You are about to drop the column `UserId` on the `MoviesSeen` table. All the data in the column will be lost.
  - Added the required column `movieid` to the `MoviesSeen` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userid` to the `MoviesSeen` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MoviesSeen" DROP COLUMN "MovieId",
DROP COLUMN "UserId",
ADD COLUMN     "movieid" TEXT NOT NULL,
ADD COLUMN     "userid" TEXT NOT NULL;
