import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import paymentsService from '@/services/payments-service';
import { badRequestError } from '@/errors';

export async function getPayments(_req: AuthenticatedRequest, res: Response) {
  const { userId } = _req as { userId: number };
  const ticketId = +_req.query.ticketId;

  try {
    if (!ticketId) {
      return res.status(httpStatus.BAD_REQUEST).send('Bad Request');
    }

    const [payments] = await paymentsService.getPayments({ userId, ticketId });

    return res.status(httpStatus.OK).send(payments);
  } catch (error) {
    if (error.name === 'BadRequestError') {
      return res.status(httpStatus.BAD_REQUEST).send('Bad Request');
    }
    if (error.name === 'NotFoundError') {
      return res.status(httpStatus.NOT_FOUND).send('Not Found');
    }
    if (error.name === 'UnauthorizedError') {
      return res.status(httpStatus.UNAUTHORIZED).send('Unauthorized');
    }
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send('Internal Server Error');
  }
}

export type PaymentInfoType = {
  ticketId: number;
  cardData: {
    issuer: string;
    number: number;
    name: string;
    expirationDate: Date;
    cvv: number;
  };
};

export async function postPayments(_req: AuthenticatedRequest, res: Response) {
  const paymentInfo = _req.body as PaymentInfoType;
  const { userId } = _req as { userId: number };

  try {
    const payment = await paymentsService.postPayments({ paymentInfo, userId });

    return res.status(httpStatus.OK).send(payment);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.status(httpStatus.NOT_FOUND).send('Not Found');
    }
    if (error.name === 'UnauthorizedError') {
      return res.status(httpStatus.UNAUTHORIZED).send('Unauthorized');
    }
    console.log(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send('Internal Server Error');
  }
}
