/*
  Warnings:

  - You are about to drop the column `passsword` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "passsword",
ADD COLUMN     "password" TEXT NOT NULL DEFAULT ' ';
