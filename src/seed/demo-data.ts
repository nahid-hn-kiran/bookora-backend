import {
  BookingStatus,
  PaymentMethod,
  PaymentStatus,
  Role,
  RoomStatus,
  UserStatus,
  VenueStatus,
} from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";

const demoIds = {
  admin: "demo-bookora-admin-user",
  customerA: "demo-bookora-customer-a",
  customerB: "demo-bookora-customer-b",
  customerC: "demo-bookora-customer-c",
  adminProfile: "demo-bookora-admin-profile",
  venueNorth: "demo-bookora-venue-north",
  venueRiverside: "demo-bookora-venue-riverside",
  venueOldTown: "demo-bookora-venue-old-town",
};

const image = (photoId: string) =>
  `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=1600&q=85`;

const venues = [
  {
    id: demoIds.venueNorth,
    name: "Cipher House Gulshan",
    description:
      "A polished escape-room studio in the heart of Gulshan, pairing cinematic sets with carefully crafted puzzles for private groups, celebrations, and team nights.",
    address: "House 18, Road 71, Gulshan 2",
    city: "Dhaka",
    country: "Bangladesh",
    phone: "+880 1700 482 190",
    email: "hello@cipherhouse.example",
    image: image("photo-1517457373958-b7bdd4587205"),
  },
  {
    id: demoIds.venueRiverside,
    name: "The Lockbox at Hatirjheel",
    description:
      "An atmospheric riverside venue built for immersive games, with welcoming hosts, dramatic rooms, and comfortable space for groups to gather before and after a mission.",
    address: "Level 3, Lakefront Arcade, Hatirjheel",
    city: "Dhaka",
    country: "Bangladesh",
    phone: "+880 1812 733 604",
    email: "play@lockbox.example",
    image: image("photo-1497366754035-f200968a6e72"),
  },
  {
    id: demoIds.venueOldTown,
    name: "Lantern & Key Dhanmondi",
    description:
      "A warm, story-led escape destination where vintage details, inventive props, and helpful game masters make every room feel like a different world.",
    address: "Road 8A, House 42, Dhanmondi",
    city: "Dhaka",
    country: "Bangladesh",
    phone: "+880 1611 905 278",
    email: "welcome@lanternkey.example",
    image: image("photo-1497366811353-6870744d04b2"),
  },
];

const rooms = [
  {
    id: "demo-bookora-room-01",
    venueId: demoIds.venueNorth,
    name: "The Archivist's Last Case",
    description:
      "A celebrated historian vanished after leaving one unfinished case behind. Follow a trail of coded letters, hidden compartments, and a missing final chapter before the archive is sealed forever.",
    capacity: 6,
    price: 3200,
    duration: 60,
    difficulty: "MEDIUM",
    image: image("photo-1511512578047-dfb367046420"),
  },
  {
    id: "demo-bookora-room-02",
    venueId: demoIds.venueNorth,
    name: "Midnight on Platform 7",
    description:
      "The last train is waiting, but its destination has been erased. Reconstruct the conductor's route, restore the station clock, and uncover why every passenger left in such a hurry.",
    capacity: 8,
    price: 3600,
    duration: 75,
    difficulty: "HARD",
    image: image("photo-1474487548417-781cb71495f3"),
  },
  {
    id: "demo-bookora-room-03",
    venueId: demoIds.venueNorth,
    name: "The Curator's Vault",
    description:
      "A private collection is about to be auctioned, but the most valuable artifact is missing. Navigate a gallery of false leads and clever mechanisms to find the original before the buyers arrive.",
    capacity: 5,
    price: 2900,
    duration: 60,
    difficulty: "EASY",
    image: image("photo-1561214115-f2f134cc4912"),
  },
  {
    id: "demo-bookora-room-04",
    venueId: demoIds.venueRiverside,
    name: "Black Tide Protocol",
    description:
      "A storm has cut communication with an offshore research station. Decode the emergency logs, stabilise the control room, and transmit the rescue coordinates before the tide turns.",
    capacity: 7,
    price: 4100,
    duration: 75,
    difficulty: "EXPERT",
    image: image("photo-1500530855697-b586d89ba3ee"),
  },
  {
    id: "demo-bookora-room-05",
    venueId: demoIds.venueRiverside,
    name: "The Clockmaker's Paradox",
    description:
      "Inside a master clockmaker's workshop, every machine tells a different version of the same hour. Align the moving parts and solve the paradox before the workshop resets.",
    capacity: 6,
    price: 3400,
    duration: 60,
    difficulty: "HARD",
    image: image("photo-1513475382585-d06e58bcb0e0"),
  },
  {
    id: "demo-bookora-room-06",
    venueId: demoIds.venueRiverside,
    name: "Operation Monsoon",
    description:
      "A weather bureau's prototype can predict the city's next great storm, but its launch sequence is locked. Assemble the forecast from field notes and bring the system online.",
    capacity: 10,
    price: 3800,
    duration: 60,
    difficulty: "MEDIUM",
    image: image("photo-1497366754035-f200968a6e72"),
  },
  {
    id: "demo-bookora-room-07",
    venueId: demoIds.venueOldTown,
    name: "The Silk Road Letter",
    description:
      "A courier's final letter contains a secret route through centuries of trade. Trace the symbols, open the travelling trunk, and deliver the message before its story is lost.",
    capacity: 6,
    price: 3000,
    duration: 60,
    difficulty: "MEDIUM",
    image: image("photo-1519681393784-d120267933ba"),
  },
  {
    id: "demo-bookora-room-08",
    venueId: demoIds.venueOldTown,
    name: "The Botanist's Conservatory",
    description:
      "A rare night-blooming specimen is ready to open, but the botanist has disappeared. Read the garden's clues, restore the greenhouse controls, and protect the discovery.",
    capacity: 5,
    price: 2800,
    duration: 60,
    difficulty: "EASY",
    image: image("photo-1497250681960-ef046c08a56e"),
  },
  {
    id: "demo-bookora-room-09",
    venueId: demoIds.venueOldTown,
    name: "The Red Ledger",
    description:
      "A vanished accountant left behind one ledger and a room full of contradictions. Reconcile the accounts, expose the hidden network, and leave with the evidence intact.",
    capacity: 8,
    price: 3500,
    duration: 75,
    difficulty: "HARD",
    image: image("photo-1556742049-0cfed4f6a45d"),
  },
  {
    id: "demo-bookora-room-10",
    venueId: demoIds.venueOldTown,
    name: "Moonlight at the Observatory",
    description:
      "The observatory's great lens has captured an impossible signal. Calibrate the instruments, map the stars, and determine what is waiting beyond the last constellation.",
    capacity: 7,
    price: 3900,
    duration: 75,
    difficulty: "EXPERT",
    image: image("photo-1446776811953-b23d57bd21aa"),
  },
];

const users = [
  {
    id: demoIds.admin,
    name: "Bookora Operations",
    email: "demo.admin@bookora.example",
    role: Role.SUPER_ADMIN,
    image: null,
  },
  {
    id: demoIds.customerA,
    name: "Maya Rahman",
    email: "maya.rahman@bookora.example",
    role: Role.USER,
    image: image("photo-1494790108377-be9c29b29330"),
  },
  {
    id: demoIds.customerB,
    name: "Arif Chowdhury",
    email: "arif.chowdhury@bookora.example",
    role: Role.USER,
    image: image("photo-1500648767791-00dcc994a43e"),
  },
  {
    id: demoIds.customerC,
    name: "Nabila Karim",
    email: "nabila.karim@bookora.example",
    role: Role.USER,
    image: image("photo-1534528741775-53994a69daeb"),
  },
];

const atUtcHour = (date: Date, hour: number) => {
  const result = new Date(date);
  result.setUTCHours(hour, 0, 0, 0);
  return result;
};

const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
};

async function main() {
  console.log("Populating Bookora demo data...");

  for (const user of users) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        status: UserStatus.ACTIVE,
        isDeleted: false,
        deletedAt: null,
      },
      create: {
        ...user,
        emailVerified: true,
        status: UserStatus.ACTIVE,
        isDeleted: false,
      },
    });
  }

  await prisma.admin.upsert({
    where: { id: demoIds.adminProfile },
    update: {
      name: users[0].name,
      email: users[0].email,
      userId: demoIds.admin,
      contactNumber: "+880 1700 000 321",
      isDeleted: false,
      deletedAt: null,
    },
    create: {
      id: demoIds.adminProfile,
      name: users[0].name,
      email: users[0].email,
      contactNumber: "+880 1700 000 321",
      userId: demoIds.admin,
    },
  });

  for (const venue of venues) {
    await prisma.venue.upsert({
      where: { id: venue.id },
      update: {
        ...venue,
        status: VenueStatus.ACTIVE,
        isDeleted: false,
        deletedAt: null,
      },
      create: {
        ...venue,
        status: VenueStatus.ACTIVE,
      },
    });
  }

  for (const room of rooms) {
    await prisma.room.upsert({
      where: { id: room.id },
      update: {
        ...room,
        status: RoomStatus.ACTIVE,
        isDeleted: false,
        deletedAt: null,
      },
      create: {
        ...room,
        status: RoomStatus.ACTIVE,
      },
    });
  }

  const baseDate = new Date();
  baseDate.setUTCHours(0, 0, 0, 0);
  const slotHours = [11, 14, 17];
  const timeSlots: Array<{
    id: string;
    roomId: string;
    date: Date;
    startTime: Date;
    endTime: Date;
  }> = [];

  for (const room of rooms) {
    for (const dayOffset of [-1, 0, 1]) {
      const date = addDays(baseDate, dayOffset);
      for (const [slotIndex, hour] of slotHours.entries()) {
        const startTime = atUtcHour(date, hour);
        const endTime = new Date(startTime);
        endTime.setUTCMinutes(endTime.getUTCMinutes() + room.duration);
        const id = `${room.id}-day${dayOffset + 1}-slot${slotIndex + 1}`;

        await prisma.timeSlot.upsert({
          where: { id },
          update: { date, startTime, endTime, roomId: room.id },
          create: { id, roomId: room.id, date, startTime, endTime },
        });

        timeSlots.push({ id, roomId: room.id, date, startTime, endTime });
      }
    }
  }

  const roomById = new Map(rooms.map((room) => [room.id, room]));
  const slotFor = (roomId: string, dayOffset: number, slotIndex: number) =>
    timeSlots.find(
      (slot) =>
        slot.roomId === roomId &&
        slot.date.getTime() === addDays(baseDate, dayOffset).getTime() &&
        slot.startTime.getUTCHours() === slotHours[slotIndex],
    );

  const bookingDefinitions = [
    {
      number: "BK-DEMO-1001",
      userId: demoIds.customerA,
      roomId: rooms[0].id,
      day: -1,
      slot: 0,
      guests: 4,
      status: BookingStatus.COMPLETED,
      notes: "A birthday experience for the group.",
    },
    {
      number: "BK-DEMO-1002",
      userId: demoIds.customerB,
      roomId: rooms[1].id,
      day: -1,
      slot: 1,
      guests: 6,
      status: BookingStatus.COMPLETED,
      notes: "Team outing after the quarterly planning session.",
    },
    {
      number: "BK-DEMO-1003",
      userId: demoIds.customerC,
      roomId: rooms[3].id,
      day: -1,
      slot: 2,
      guests: 5,
      status: BookingStatus.COMPLETED,
      notes: "Celebrating a promotion.",
    },
    {
      number: "BK-DEMO-1004",
      userId: demoIds.customerA,
      roomId: rooms[6].id,
      day: 0,
      slot: 0,
      guests: 4,
      status: BookingStatus.CONFIRMED,
      notes: "Weekend city adventure.",
    },
    {
      number: "BK-DEMO-1005",
      userId: demoIds.customerB,
      roomId: rooms[4].id,
      day: 0,
      slot: 1,
      guests: 5,
      status: BookingStatus.CONFIRMED,
      notes: "Please allow a few minutes for arrival and briefing.",
    },
    {
      number: "BK-DEMO-1006",
      userId: demoIds.customerC,
      roomId: rooms[8].id,
      day: 1,
      slot: 0,
      guests: 7,
      status: BookingStatus.PENDING,
      notes: "Planning a family get-together.",
    },
    {
      number: "BK-DEMO-1007",
      userId: demoIds.customerA,
      roomId: rooms[2].id,
      day: 1,
      slot: 1,
      guests: 3,
      status: BookingStatus.CANCELLED,
      notes: "Cancelled by customer.",
    },
    {
      number: "BK-DEMO-1008",
      userId: demoIds.customerB,
      roomId: rooms[9].id,
      day: 1,
      slot: 2,
      guests: 6,
      status: BookingStatus.CONFIRMED,
      notes: "A first-time escape room visit.",
    },
  ];

  for (const definition of bookingDefinitions) {
    const slot = slotFor(definition.roomId, definition.day, definition.slot);
    const room = roomById.get(definition.roomId);

    if (!slot || !room) {
      throw new Error(`Unable to resolve demo booking ${definition.number}.`);
    }

    const booking = await prisma.booking.upsert({
      where: { bookingNumber: definition.number },
      update: {
        userId: definition.userId,
        timeSlotId: slot.id,
        guestCount: definition.guests,
        totalAmount: room.price,
        status: definition.status,
        notes: definition.notes,
        expiresAt:
          definition.status === BookingStatus.PENDING
            ? new Date(Date.now() + 15 * 60 * 1000)
            : null,
      },
      create: {
        bookingNumber: definition.number,
        userId: definition.userId,
        timeSlotId: slot.id,
        guestCount: definition.guests,
        totalAmount: room.price,
        status: definition.status,
        notes: definition.notes,
        expiresAt:
          definition.status === BookingStatus.PENDING
            ? new Date(Date.now() + 15 * 60 * 1000)
            : null,
      },
    });

    const shouldHavePayment = definition.status !== BookingStatus.PENDING;
    if (shouldHavePayment) {
      const isPaid = definition.status !== BookingStatus.CANCELLED;
      await prisma.payment.upsert({
        where: { bookingId: booking.id },
        update: {
          amount: room.price,
          method: PaymentMethod.STRIPE,
          status: isPaid ? PaymentStatus.PAID : PaymentStatus.REFUNDED,
          transactionId: `demo_txn_${definition.number}`,
          paymentIntentId: `demo_pi_${definition.number}`,
          paidAt: isPaid ? new Date() : null,
        },
        create: {
          bookingId: booking.id,
          amount: room.price,
          method: PaymentMethod.STRIPE,
          status: isPaid ? PaymentStatus.PAID : PaymentStatus.REFUNDED,
          transactionId: `demo_txn_${definition.number}`,
          paymentIntentId: `demo_pi_${definition.number}`,
          paidAt: isPaid ? new Date() : null,
        },
      });
    }
  }

  console.log(
    `Demo data ready: ${venues.length} venues, ${rooms.length} rooms, ${timeSlots.length} time slots, ${bookingDefinitions.length} bookings.`,
  );
}

main()
  .catch((error) => {
    console.error("Demo data population failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
