import { Hotel, Room, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getHotels(): Promise<Hotel[]> {
  return prisma.hotel.findMany();
}

export async function getHotelRooms(hotelId: number): Promise<Hotel & { Rooms: Room[] }> {
  return prisma.hotel.findFirst({
    where: { id: hotelId },
    include: { Rooms: true },
  });
}

const hotelsRepository = {
  getHotels,
  getHotelRooms,
};

export default hotelsRepository;
