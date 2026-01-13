/*
  Warnings:

  - You are about to drop the column `degreeEs` on the `Education` table. All the data in the column will be lost.
  - You are about to drop the column `descriptionEs` on the `Education` table. All the data in the column will be lost.
  - You are about to drop the column `fieldEs` on the `Education` table. All the data in the column will be lost.
  - You are about to drop the column `institutionEs` on the `Education` table. All the data in the column will be lost.
  - You are about to drop the column `descriptionEs` on the `Hobby` table. All the data in the column will be lost.
  - You are about to drop the column `nameEs` on the `Hobby` table. All the data in the column will be lost.
  - You are about to drop the column `descriptionEs` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `titleEs` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `nameEs` on the `Skill` table. All the data in the column will be lost.
  - You are about to drop the column `companyEs` on the `WorkExperience` table. All the data in the column will be lost.
  - You are about to drop the column `descriptionEs` on the `WorkExperience` table. All the data in the column will be lost.
  - You are about to drop the column `positionEs` on the `WorkExperience` table. All the data in the column will be lost.
  - Added the required column `degreeFr` to the `Education` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fieldFr` to the `Education` table without a default value. This is not possible if the table is not empty.
  - Added the required column `institutionFr` to the `Education` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameFr` to the `Hobby` table without a default value. This is not possible if the table is not empty.
  - Added the required column `descriptionFr` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titleFr` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameFr` to the `Skill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyFr` to the `WorkExperience` table without a default value. This is not possible if the table is not empty.
  - Added the required column `descriptionFr` to the `WorkExperience` table without a default value. This is not possible if the table is not empty.
  - Added the required column `positionFr` to the `WorkExperience` table without a default value. This is not possible if the table is not empty.

*/
-- Rename Spanish columns to French (preserves existing data)
ALTER TABLE "Education" 
  RENAME COLUMN "degreeEs" TO "degreeFr";
ALTER TABLE "Education" 
  RENAME COLUMN "descriptionEs" TO "descriptionFr";
ALTER TABLE "Education" 
  RENAME COLUMN "fieldEs" TO "fieldFr";
ALTER TABLE "Education" 
  RENAME COLUMN "institutionEs" TO "institutionFr";

ALTER TABLE "Hobby" 
  RENAME COLUMN "descriptionEs" TO "descriptionFr";
ALTER TABLE "Hobby" 
  RENAME COLUMN "nameEs" TO "nameFr";

ALTER TABLE "Project" 
  RENAME COLUMN "descriptionEs" TO "descriptionFr";
ALTER TABLE "Project" 
  RENAME COLUMN "titleEs" TO "titleFr";

ALTER TABLE "Skill" 
  RENAME COLUMN "nameEs" TO "nameFr";

ALTER TABLE "WorkExperience" 
  RENAME COLUMN "companyEs" TO "companyFr";
ALTER TABLE "WorkExperience" 
  RENAME COLUMN "descriptionEs" TO "descriptionFr";
ALTER TABLE "WorkExperience" 
  RENAME COLUMN "positionEs" TO "positionFr";
