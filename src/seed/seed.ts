import {
  BookingStatus,
  PaymentMethod,
  PaymentStatus,
  Role,
  RoomStatus,
  UserStatus,
  VenueStatus,
} from "../generated/prisma/enums";
import { prisma } from "../lib/prisma";

async function main() {
  console.log("Seeding database...");

  // --------------------------------------------------
  // USERS
  // --------------------------------------------------

  const adminUser = await prisma.user.upsert({
    where: {
      email: "nahid.hn.kiran@gmail.com",
    },
    update: {},
    create: {
      id: crypto.randomUUID(),
      name: "System Admin",
      email: "nahid.hn.kiran@gmail.com",
      password: "Nahid1234@N",
      emailVerified: true,
      role: Role.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
    },
  });

  const customerOne = await prisma.user.upsert({
    where: {
      email: "nahidhasankiran2@gmail.com",
    },
    update: {},
    create: {
      id: crypto.randomUUID(),
      name: "Nahid Hasan",
      email: "nahidhasankiran2@gmail.com",
      emailVerified: true,
      role: Role.USER,
      status: UserStatus.ACTIVE,
    },
  });

  const customerTwo = await prisma.user.upsert({
    where: {
      email: "kiran@example.com",
    },
    update: {},
    create: {
      id: crypto.randomUUID(),
      name: "NH Kiran",
      email: "Kiran@example.com",
      emailVerified: true,
      role: Role.USER,
      status: UserStatus.ACTIVE,
    },
  });

  // --------------------------------------------------
  // ADMIN PROFILE
  // --------------------------------------------------

  await prisma.admin.upsert({
    where: {
      userId: adminUser.id,
    },
    update: {},
    create: {
      name: adminUser.name,
      email: adminUser.email,
      contactNumber: "+8801700000000",
      userId: adminUser.id,
    },
  });

  // --------------------------------------------------
  // VENUE
  // --------------------------------------------------

  const venue = await prisma.venue.create({
    data: {
      name: "Escape Dhaka",
      description:
        "A real-world escape room experience with challenging puzzles and immersive rooms.",
      address: "House 12, Road 5, Dhanmondi",
      city: "Dhaka",
      country: "Bangladesh",
      phone: "+8801700000000",
      email: "hello@escapeddhaka.com",
      status: VenueStatus.ACTIVE,
    },
  });

  // --------------------------------------------------
  // ROOMS
  // --------------------------------------------------

  const hauntedRoom = await prisma.room.create({
    data: {
      name: "The Haunted Mansion",
      description:
        "A mysterious mansion filled with hidden clues, puzzles and unexpected surprises.",
      capacity: 6,
      price: 2500,
      duration: 60,
      difficulty: "HARD",
      status: RoomStatus.ACTIVE,
      venueId: venue.id,
    },
  });

  const bankRoom = await prisma.room.create({
    data: {
      name: "The Bank Heist",
      description:
        "Break into the vault, solve the security puzzles and escape before time runs out.",
      capacity: 8,
      price: 3000,
      duration: 75,
      difficulty: "MEDIUM",
      status: RoomStatus.ACTIVE,
      venueId: venue.id,
    },
  });

  const prisonRoom = await prisma.room.create({
    data: {
      name: "Prison Break",
      description:
        "You have been locked inside a high-security prison. Find your way out.",
      capacity: 6,
      price: 2200,
      duration: 60,
      difficulty: "EASY",
      status: RoomStatus.ACTIVE,
      venueId: venue.id,
    },
  });

  // --------------------------------------------------
  // TIME SLOTS
  // --------------------------------------------------

  const createTimeSlot = (
    roomId: string,
    date: Date,
    startHour: number,
    startMinute: number,
    duration: number,
  ) => {
    const startTime = new Date(date);

    startTime.setHours(startHour, startMinute, 0, 0);

    const endTime = new Date(startTime);

    endTime.setMinutes(endTime.getMinutes() + duration);

    return {
      roomId,
      date,
      startTime,
      endTime,
    };
  };

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);

  tomorrow.setDate(tomorrow.getDate() + 1);

  const dayAfterTomorrow = new Date(today);

  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

  await prisma.timeSlot.createMany({
    data: [
      // ----------------------------------------------
      // Haunted Mansion - Today
      // ----------------------------------------------
      createTimeSlot(hauntedRoom.id, today, 10, 0, 60),
      createTimeSlot(hauntedRoom.id, today, 11, 30, 60),
      createTimeSlot(hauntedRoom.id, today, 13, 0, 60),
      createTimeSlot(hauntedRoom.id, today, 14, 30, 60),
      createTimeSlot(hauntedRoom.id, today, 16, 0, 60),
      createTimeSlot(hauntedRoom.id, today, 17, 30, 60),

      // Haunted Mansion - Tomorrow
      createTimeSlot(hauntedRoom.id, tomorrow, 10, 0, 60),
      createTimeSlot(hauntedRoom.id, tomorrow, 11, 30, 60),
      createTimeSlot(hauntedRoom.id, tomorrow, 13, 0, 60),
      createTimeSlot(hauntedRoom.id, tomorrow, 14, 30, 60),
      createTimeSlot(hauntedRoom.id, tomorrow, 16, 0, 60),
      createTimeSlot(hauntedRoom.id, tomorrow, 17, 30, 60),

      // Haunted Mansion - Day After Tomorrow
      createTimeSlot(hauntedRoom.id, dayAfterTomorrow, 10, 0, 60),
      createTimeSlot(hauntedRoom.id, dayAfterTomorrow, 11, 30, 60),
      createTimeSlot(hauntedRoom.id, dayAfterTomorrow, 13, 0, 60),
      createTimeSlot(hauntedRoom.id, dayAfterTomorrow, 14, 30, 60),
      createTimeSlot(hauntedRoom.id, dayAfterTomorrow, 16, 0, 60),
      createTimeSlot(hauntedRoom.id, dayAfterTomorrow, 17, 30, 60),

      // ----------------------------------------------
      // Bank Heist - Today
      // ----------------------------------------------
      createTimeSlot(bankRoom.id, today, 10, 0, 75),
      createTimeSlot(bankRoom.id, today, 11, 30, 75),
      createTimeSlot(bankRoom.id, today, 13, 0, 75),
      createTimeSlot(bankRoom.id, today, 14, 30, 75),
      createTimeSlot(bankRoom.id, today, 16, 0, 75),
      createTimeSlot(bankRoom.id, today, 17, 30, 75),

      // Bank Heist - Tomorrow
      createTimeSlot(bankRoom.id, tomorrow, 10, 0, 75),
      createTimeSlot(bankRoom.id, tomorrow, 11, 30, 75),
      createTimeSlot(bankRoom.id, tomorrow, 13, 0, 75),
      createTimeSlot(bankRoom.id, tomorrow, 14, 30, 75),
      createTimeSlot(bankRoom.id, tomorrow, 16, 0, 75),
      createTimeSlot(bankRoom.id, tomorrow, 17, 30, 75),

      // ----------------------------------------------
      // Prison Break - Today
      // ----------------------------------------------
      createTimeSlot(prisonRoom.id, today, 10, 0, 60),
      createTimeSlot(prisonRoom.id, today, 11, 30, 60),
      createTimeSlot(prisonRoom.id, today, 13, 0, 60),
      createTimeSlot(prisonRoom.id, today, 14, 30, 60),
      createTimeSlot(prisonRoom.id, today, 16, 0, 60),
      createTimeSlot(prisonRoom.id, today, 17, 30, 60),

      // Prison Break - Tomorrow
      createTimeSlot(prisonRoom.id, tomorrow, 10, 0, 60),
      createTimeSlot(prisonRoom.id, tomorrow, 11, 30, 60),
      createTimeSlot(prisonRoom.id, tomorrow, 13, 0, 60),
      createTimeSlot(prisonRoom.id, tomorrow, 14, 30, 60),
      createTimeSlot(prisonRoom.id, tomorrow, 16, 0, 60),
      createTimeSlot(prisonRoom.id, tomorrow, 17, 30, 60),
    ],
  });

  // --------------------------------------------------
  // CREATE ONE BOOKING
  // --------------------------------------------------

  const bookedSlot = await prisma.timeSlot.findFirst({
    where: {
      roomId: hauntedRoom.id,
      date: today,
      startTime: {
        gte: new Date(today.setHours(10, 0, 0, 0)),
      },
    },
    orderBy: {
      startTime: "asc",
    },
  });

  if (bookedSlot) {
    const booking = await prisma.booking.create({
      data: {
        bookingNumber: "BK-100001",

        userId: customerOne.id,
        roomId: hauntedRoom.id,
        timeSlotId: bookedSlot.id,

        bookingDate: today,
        guestCount: 4,

        totalAmount: 2500,

        status: BookingStatus.CONFIRMED,

        notes: "Birthday booking.",
      },
    });

    await prisma.payment.create({
      data: {
        bookingId: booking.id,
        amount: 2500,
        method: PaymentMethod.STRIPE,
        status: PaymentStatus.PAID,
        transactionId: "txn_demo_100001",
        paymentIntentId: "pi_demo_100001",
        paidAt: new Date(),
      },
    });
  }

  // --------------------------------------------------
  // SECOND BOOKING
  // --------------------------------------------------

  const secondSlot = await prisma.timeSlot.findFirst({
    where: {
      roomId: bankRoom.id,
      date: tomorrow,
    },
    orderBy: {
      startTime: "asc",
    },
  });

  if (secondSlot) {
    const booking = await prisma.booking.create({
      data: {
        bookingNumber: "BK-100002",

        userId: customerTwo.id,
        roomId: bankRoom.id,
        timeSlotId: secondSlot.id,

        bookingDate: tomorrow,
        guestCount: 5,

        totalAmount: 3000,

        status: BookingStatus.PENDING,

        notes: "Looking forward to the experience.",
      },
    });

    await prisma.payment.create({
      data: {
        bookingId: booking.id,
        amount: 3000,
        method: PaymentMethod.STRIPE,
        status: PaymentStatus.PENDING,
      },
    });
  }

  console.log("Database seeded successfully.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
