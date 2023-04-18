import { prisma } from '@/config';
import { PaymentInfoType } from '@/controllers';

const getPayments = async () => {
  return await prisma.payment.findMany();
};

const postPayments = async ({ ticketId, cardData, value }: PaymentInfoType & { value: number }) => {
  return await prisma.payment.create({
    data: { ticketId, cardIssuer: cardData.issuer, cardLastDigits: String(cardData.number).slice(-4), value: value },
  });
};

const paymentsRepository = {
  getPayments,
  postPayments,
};

export default paymentsRepository;
