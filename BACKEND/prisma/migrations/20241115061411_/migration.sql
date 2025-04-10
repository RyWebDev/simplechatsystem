/*
  Warnings:

  - You are about to alter the column `sender_id` on the `chat` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `chat` MODIFY `receiver_id` VARCHAR(191) NOT NULL,
    MODIFY `sender_id` INTEGER NOT NULL;
