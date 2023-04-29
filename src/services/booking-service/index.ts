import { cannotBookError, notFoundError } from '@/errors';
import bookingRepository from '@/repositories/booking-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';

async function verifyAvailabilityFromRooms(roomId: number) {
  const room = await bookingRepository.findRoomById(roomId);

  if (!room) throw notFoundError();

  const qntyOfBookings = await bookingRepository.countBookingsFromRoom(roomId);

  if (qntyOfBookings >= room.capacity) throw cannotBookError();

  return room;
}

async function listHotels(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw cannotBookError();
  }
  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status !== 'PAID' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw cannotBookError();
  }
}

async function getBooking(userId: number) {
  const booking = await bookingRepository.getBooking(userId);

  if (!booking) throw notFoundError();

  return booking;
}

async function postBooking(userId: number, roomId: number) {
  await listHotels(userId);
  await verifyAvailabilityFromRooms(roomId);

  return await bookingRepository.postBooking(userId, roomId);
}

async function updateBooking(userId: number, bookingId: string, roomId: number) {
  const booking_id = Number(bookingId);

  await verifyAvailabilityFromRooms(roomId);

  const userBooking = await bookingRepository.getBooking(userId);

  if (!userBooking) throw cannotBookError();

  return await bookingRepository.updateBooking(roomId, booking_id, userId);
}

export const bookingService = {
  getBooking,
  postBooking,
  updateBooking,
};
