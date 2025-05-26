/*
  Warnings:

  - A unique constraint covering the columns `[uniqueSlug]` on the table `parishes` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "parishes" ADD COLUMN     "bankAccount" TEXT,
ADD COLUMN     "uniqueSlug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "parishes_uniqueSlug_key" ON "parishes"("uniqueSlug");
