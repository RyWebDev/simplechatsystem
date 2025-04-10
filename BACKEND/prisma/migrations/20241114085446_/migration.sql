/*
  Warnings:

  - Added the required column `receiver_id` to the `Chat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sender_id` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `chat` ADD COLUMN `receiver_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `sender_id` VARCHAR(191) NOT NULL;
