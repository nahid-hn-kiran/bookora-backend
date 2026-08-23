-- DropIndex
DROP INDEX "bookings_timeSlotId_key";

-- CreateIndex
CREATE UNIQUE INDEX "bookings_active_timeslot_unique"
ON "bookings" ("timeSlotId")
WHERE "status" IN ('PENDING', 'CONFIRMED');
