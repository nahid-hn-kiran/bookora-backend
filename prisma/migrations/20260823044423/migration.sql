/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `activity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `project` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `task` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `workspace` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `workspace_member` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "activity" DROP CONSTRAINT "activity_performedBy_fkey";

-- DropForeignKey
ALTER TABLE "activity" DROP CONSTRAINT "activity_projectId_fkey";

-- DropForeignKey
ALTER TABLE "activity" DROP CONSTRAINT "activity_taskId_fkey";

-- DropForeignKey
ALTER TABLE "activity" DROP CONSTRAINT "activity_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "comment" DROP CONSTRAINT "comment_authorId_fkey";

-- DropForeignKey
ALTER TABLE "comment" DROP CONSTRAINT "comment_taskId_fkey";

-- DropForeignKey
ALTER TABLE "project" DROP CONSTRAINT "project_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "task" DROP CONSTRAINT "task_assignedTo_fkey";

-- DropForeignKey
ALTER TABLE "task" DROP CONSTRAINT "task_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "task" DROP CONSTRAINT "task_projectId_fkey";

-- DropForeignKey
ALTER TABLE "workspace_member" DROP CONSTRAINT "workspace_member_userId_fkey";

-- DropForeignKey
ALTER TABLE "workspace_member" DROP CONSTRAINT "workspace_member_workspaceId_fkey";

-- DropIndex
DROP INDEX "admins_email_idx";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "deletedAt",
DROP COLUMN "isDeleted";

-- DropTable
DROP TABLE "activity";

-- DropTable
DROP TABLE "comment";

-- DropTable
DROP TABLE "project";

-- DropTable
DROP TABLE "task";

-- DropTable
DROP TABLE "workspace";

-- DropTable
DROP TABLE "workspace_member";

-- DropEnum
DROP TYPE "ActivityAction";

-- DropEnum
DROP TYPE "ActivityEntity";

-- DropEnum
DROP TYPE "TaskPriority";

-- DropEnum
DROP TYPE "TaskStatus";

-- DropEnum
DROP TYPE "WorkspaceRole";
