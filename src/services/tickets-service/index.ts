import { notFoundError } from '@/errors';
import { ticketRepository } from '@/repositories/ticket-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';

async function findTickets(userId: number) {
  const { id: enrollmentId } = await enrollmentRepository.findEnrollmentByUserId(userId);
  if (!enrollmentId) {
    throw notFoundError();
  }
  return await ticketRepository.findTickets();
}

async function findTicketById(ticketId: number) {
  return await ticketRepository.findTicketById(ticketId);
}

async function findTicketTypes() {
  return await ticketRepository.findTicketsTypes();
}

async function createTicket(ticket: { ticketTypeId: number; userId: number }) {
  const { ticketTypeId, userId } = ticket;
  const { id: enrollmentId } = await enrollmentRepository.findEnrollmentByUserId(userId);
  if (!enrollmentId) {
    throw notFoundError();
  }
  const response = await ticketRepository.createTicket({ ticketTypeId, enrollmentId });
  if (!response) {
    throw notFoundError();
  }
  return response;
}

async function getTicketType(ticketTypeId: number) {
  return await ticketRepository.findTicketTypeById(ticketTypeId);
}

async function updateTicketStatusToPaid(ticketId: number) {
  return await ticketRepository.updateTicketById(ticketId);
}

const ticketService = {
  findTickets,
  findTicketById,
  findTicketTypes,
  createTicket,
  getTicketType,
  updateTicketStatusToPaid,
};

export default ticketService;
