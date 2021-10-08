/*
  Warnings:

  - Changed the type of `lastTimewatch` on the `Movies` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Movies" DROP COLUMN "lastTimewatch",
ADD COLUMN     "lastTimewatch" INTEGER NOT NULL;
