/*
  Warnings:

  - You are about to drop the `lists` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `lists`;

-- CreateTable
CREATE TABLE `List` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
