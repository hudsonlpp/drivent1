import { Room } from '@prisma/client';
import { prisma } from '@/config';

async function findRoomById(roomId: number): Promise<Room> {
  return await prisma.room.findFirst({
    where: {
      id: roomId,
    },
  });
}

async function countBookingsFromRoom(roomId: number) {
  return await prisma.booking.count({
    where: {
      roomId,
    },
  });
}

async function getBooking(userId: number): Promise<{ Room: Room; id: number }> {
  return await prisma.booking.findFirst({
    where: {
      userId,
    },
    select: {
      id: true,
      Room: true,
    },
  });
}

async function postBooking(userId: number, roomId: number) {
  const booking = await prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });

  return booking.id;
}

async function updateBooking(roomId: number, bookingId: number, userId: number) {
  const update = await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      roomId,
      userId,
    },
  });

  return update.id;
}

const bookingRepository = {
  findRoomById,
  countBookingsFromRoom,
  getBooking,
  postBooking,
  updateBooking,
};

export default bookingRepository;
