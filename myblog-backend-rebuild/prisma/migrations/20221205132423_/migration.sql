-- DropForeignKey
ALTER TABLE `Comment` DROP FOREIGN KEY `Comment_parentId_fkey`;

-- DropForeignKey
ALTER TABLE `Comment` DROP FOREIGN KEY `Comment_rootId_fkey`;

-- AddForeignKey
ALTER TABLE `Comment`
  ADD CONSTRAINT `Comment_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Comment` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment`
  ADD CONSTRAINT `Comment_rootId_fkey` FOREIGN KEY (`rootId`) REFERENCES `Comment` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
