-- AlterTable
ALTER TABLE "Hobby" ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "links" JSONB,
ADD COLUMN     "startDate" TIMESTAMP(3),
ADD COLUMN     "technologies" TEXT[];
