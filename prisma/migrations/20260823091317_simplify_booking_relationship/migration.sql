/*
  Warnings:

  - You are about to drop the column `bookingDate` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `roomId` on the `bookings` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[timeSlotId]` on the table `bookings` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_roomId_fkey";

-- DropIndex
DROP INDEX "bookings_bookingDate_idx";

-- DropIndex
DROP INDEX "bookings_roomId_idx";

-- DropIndex
DROP INDEX "bookings_timeSlotId_bookingDate_key";

-- DropIndex
DROP INDEX "bookings_timeSlotId_idx";

-- DropIndex
DROP INDEX "time_slots_roomId_date_startTime_key";

-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "bookingDate",
DROP COLUMN "roomId";

-- CreateIndex
CREATE UNIQUE INDEX "bookings_timeSlotId_key" ON "bookings"("timeSlotId");
