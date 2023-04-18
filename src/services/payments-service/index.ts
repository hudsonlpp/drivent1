import { notFoundError, unauthorizedError } from '@/errors';
import { ticketRepository } from '@/repositories/ticket-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import paymentsRepository from '@/repositories/payments-repository';
import { PaymentInfoType } from '@/controllers';

type getPaymentsType = { userId: number; ticketId: number };

async function getPayments({ userId, ticketId }: getPaymentsType) {
  const ticket = await ticketRepository.findTicketById(ticketId);

  if (!ticket) {
    throw notFoundError();
  }

  const enrollment = await enrollmentRepository.findEnrollmentById(ticket.enrollmentId);

  if (!enrollment) {
    throw notFoundError();
  }

  if (enrollment.userId !== userId) {
    throw unauthorizedError();
  }

  return await paymentsRepository.getPayments();
}

type postPaymentsType = {
  paymentInfo: PaymentInfoType;
  userId: number;
};

async function postPayments({ paymentInfo, userId }: postPaymentsType) {
  const { ticketId, cardData } = paymentInfo;

  const ticket = await ticketRepository.findTicketById(ticketId);

  if (!ticket) {
    throw notFoundError();
  }

  const ticketType = await ticketRepository.findTicketTypeById(ticket.ticketTypeId);

  const enrollment = await enrollmentRepository.findEnrollmentById(ticket.enrollmentId);

  if (!enrollment) {
    throw notFoundError();
  }

  if (enrollment.userId !== userId) {
    throw unauthorizedError();
  }

  await ticketRepository.updateTicketById(ticketId);

  return await paymentsRepository.postPayments({ ticketId, cardData, value: ticketType.price });
}

const paymentsService = {
  getPayments,
  postPayments,
};

export default paymentsService;
