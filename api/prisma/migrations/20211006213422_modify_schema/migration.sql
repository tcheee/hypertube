/*
  Warnings:

  - You are about to drop the column `moviesId` on the `Comment` table. All the data in the column will be lost.
  - Added the required column `movieId` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "moviesId",
ADD COLUMN     "movieId" TEXT NOT NULL;
