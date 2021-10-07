/*
  Warnings:

  - Added the required column `hash` to the `Movies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Movies" ADD COLUMN     "hash" TEXT NOT NULL,
ALTER COLUMN "movieId" SET DATA TYPE TEXT;
