import { Hotel, Room, TicketStatus } from '@prisma/client';
import hotelsRepository from '@/repositories/hotels-repository';
import { notFoundError, paymentRequiredError } from '@/errors';
import enrollmentRepository from '@/repositories/enrollment-repository';
import { ticketRepository } from '@/repositories/ticket-repository';

async function verifyHotelTicketAndPayment(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  const ticketType = await ticketRepository.findTicketTypeById(ticket.ticketTypeId);
  console.log('console');

  if (!enrollment || !ticket) {
    console.log('erro entrou aq');
    throw notFoundError();
  }

  if (ticket.status !== TicketStatus.PAID || ticketType.isRemote === true || ticketType.includesHotel === false) {
    console.log('erro entrou assado');
    throw paymentRequiredError();
  }
  console.log(enrollment, ticket);
  return [enrollment, ticket];
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
