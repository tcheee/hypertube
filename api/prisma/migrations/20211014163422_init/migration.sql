-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "firstname" TEXT,
    "lastname" TEXT,
    "username" TEXT,
    "image" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Movies" (
    "hash" TEXT NOT NULL,
    "id" SERIAL NOT NULL,
    "movieId" TEXT NOT NULL,
    "resolution" TEXT,
    "image_link" TEXT,
    "lastTimewatch" INTEGER NOT NULL,
    "isDownload" BOOLEAN NOT NULL,
    "summary" TEXT,
    "title" TEXT,
    "rating" TEXT,
    "productionYear" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MoviesSeen" (
    "id" SERIAL NOT NULL,
    "MovieId" INTEGER NOT NULL,
    "UserId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "fromId" INTEGER NOT NULL,
    "movieId" TEXT NOT NULL,
    "comment" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Movies.hash_unique" ON "Movies"("hash");

-- AddForeignKey
ALTER TABLE "Comment" ADD FOREIGN KEY ("fromId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
