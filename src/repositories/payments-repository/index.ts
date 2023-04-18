import { prisma } from '@/config';
import { PaymentInfoType } from '@/controllers';

const findPayments = async () => {
  return await prisma.payment.findMany();
};

const createPayment = async ({ ticketId, cardData, value }: PaymentInfoType & { value: number }) => {
  return await prisma.payment.create({
    data: { ticketId, cardIssuer: cardData.issuer, cardLastDigits: String(cardData.number).slice(-4), value: value },
  });
};

const paymentsRepository = {
  findPayments,
  createPayment,
};

export default paymentsRepository;
