/*
  Warnings:

  - A unique constraint covering the columns `[hash]` on the table `Movies` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Movies.hash_unique" ON "Movies"("hash");
