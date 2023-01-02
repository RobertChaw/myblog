-- CreateTable
CREATE TABLE `User`
(
    `id`        INTEGER      NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP (3),
    `updatedAt` DATETIME(3) NOT NULL,
    `username`  VARCHAR(191) NOT NULL,
    `password`  VARCHAR(191) NOT NULL,
    `isAdmin`   BOOLEAN      NOT NULL,
    `avatar`    VARCHAR(191) NOT NULL,
    `isBanned`  BOOLEAN      NOT NULL DEFAULT false,

    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserFromGitHub`
(
    `id`        INTEGER      NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP (3),
    `updatedAt` DATETIME(3) NOT NULL,
    `githubId`  INTEGER      NOT NULL,
    `name`      VARCHAR(191) NOT NULL,
    `url`       VARCHAR(191) NOT NULL,
    `userId`    INTEGER      NOT NULL,

    UNIQUE INDEX `UserFromGitHub_githubId_key`(`githubId`),
    UNIQUE INDEX `UserFromGitHub_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Article`
(
    `id`          INTEGER      NOT NULL AUTO_INCREMENT,
    `createdAt`   DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP (3),
    `updatedAt`   DATETIME(3) NOT NULL,
    `title`       VARCHAR(191) NOT NULL,
    `content`     TEXT         NOT NULL,
    `description` TEXT         NOT NULL,
    `viewCount`   INTEGER      NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tag`
(
    `id`        INTEGER      NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP (3),
    `updatedAt` DATETIME(3) NOT NULL,
    `title`     VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Tag_title_key`(`title`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Comment`
(
    `id`        INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP (3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId`    INTEGER NOT NULL,
    `message`   TEXT    NOT NULL,
    `articleId` INTEGER NOT NULL,
    `parentId`  INTEGER NULL,
    `rootId`    INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ArticleToTag`
(
    `A`   INTEGER NOT NULL,
    `B`   INTEGER NOT NULL,

    UNIQUE INDEX `_ArticleToTag_AB_unique`(`A`, `B`),
    INDEX `_ArticleToTag_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserFromGitHub`
    ADD CONSTRAINT `UserFromGitHub_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment`
    ADD CONSTRAINT `Comment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment`
    ADD CONSTRAINT `Comment_articleId_fkey` FOREIGN KEY (`articleId`) REFERENCES `Article` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment`
    ADD CONSTRAINT `Comment_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Comment` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment`
    ADD CONSTRAINT `Comment_rootId_fkey` FOREIGN KEY (`rootId`) REFERENCES `Comment` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ArticleToTag`
    ADD CONSTRAINT `_ArticleToTag_A_fkey` FOREIGN KEY (`A`) REFERENCES `Article` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ArticleToTag`
    ADD CONSTRAINT `_ArticleToTag_B_fkey` FOREIGN KEY (`B`) REFERENCES `Tag` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
