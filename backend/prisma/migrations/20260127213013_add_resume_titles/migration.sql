/*
  Warnings:

  - You are about to drop the column `current` on the `Resume` table. All the data in the column will be lost.
  - Added the required column `titleEn` to the `Resume` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titleFr` to the `Resume` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Resume" DROP COLUMN "current",
ADD COLUMN     "descriptionEn" TEXT,
ADD COLUMN     "descriptionFr" TEXT,
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "titleEn" TEXT NOT NULL,
ADD COLUMN     "titleFr" TEXT NOT NULL;
