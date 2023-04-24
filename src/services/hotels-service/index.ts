import { Hotel, Room } from '@prisma/client';
import hotelsRepository from '@/repositories/hotels-repository';
import { notFoundError, paymentRequiredError } from '@/errors';
import enrollmentRepository from '@/repositories/enrollment-repository';
import { ticketRepository } from '@/repositories/ticket-repository';

async function verifyHotelTicketAndPayment(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status !== 'PAID' || !ticket.TicketType.includesHotel || ticket.TicketType.isRemote) {
    throw paymentRequiredError();
  }

  return [enrollment, ticket] as const;
}

async function getHotels(userId: number): Promise<Hotel[]> {
  await verifyHotelTicketAndPayment(userId);

  const hotels = await hotelsRepository.getHotels();

  if (!hotels.length) {
    throw notFoundError();
  }

  return hotels;
}

async function getHotelRooms(hotelId: string, userId: number): Promise<Hotel & { Rooms: Room[] }> {
  const hotelIdNumber = Number(hotelId);

  await verifyHotelTicketAndPayment(userId);

  const hotelWithRooms = await hotelsRepository.getHotelRooms(hotelIdNumber);

  if (!hotelWithRooms) {
    throw notFoundError();
  }

  return hotelWithRooms;
}

const hotelsService = {
  getHotels,
  getHotelRooms,
};

export default hotelsService;
