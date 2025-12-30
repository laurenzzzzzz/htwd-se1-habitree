/*
  Warnings:

  - You are about to drop the column `name` on the `habit` table. All the data in the column will be lost.
  - Added the required column `description` to the `habit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `label` to the `habit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "habit" DROP COLUMN "name",
ADD COLUMN     "checked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "label" TEXT NOT NULL;
