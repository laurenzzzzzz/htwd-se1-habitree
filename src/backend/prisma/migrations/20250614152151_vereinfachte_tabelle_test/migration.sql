/*
  Warnings:

  - You are about to drop the column `checked` on the `habit` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `habit` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `habit` table. All the data in the column will be lost.
  - You are about to drop the column `label` on the `habit` table. All the data in the column will be lost.
  - Added the required column `name` to the `habit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "habit" DROP COLUMN "checked",
DROP COLUMN "createdAt",
DROP COLUMN "description",
DROP COLUMN "label",
ADD COLUMN     "name" TEXT NOT NULL;
