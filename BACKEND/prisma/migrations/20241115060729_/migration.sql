/*
  Warnings:

  - You are about to alter the column `receiver_id` on the `chat` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `sender_id` on the `chat` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `chat` MODIFY `receiver_id` INTEGER NOT NULL,
    MODIFY `sender_id` INTEGER NOT NULL;
