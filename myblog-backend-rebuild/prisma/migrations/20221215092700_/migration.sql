/*
  Warnings:

  - You are about to drop the `UserFromGitHub` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[githubId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `githubId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `UserFromGitHub` DROP FOREIGN KEY `UserFromGitHub_userId_fkey`;

-- AlterTable
ALTER TABLE `User`
  ADD COLUMN `githubId` INTEGER NOT NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `url` VARCHAR(191) NOT NULL,
    MODIFY `isAdmin` BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE `UserFromGitHub`;

-- CreateIndex
CREATE UNIQUE INDEX `User_githubId_key` ON `User` (`githubId`);
