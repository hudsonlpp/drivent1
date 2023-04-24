import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import paymentsService from '@/services/payments-service';

export async function getPayments(_req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = _req as { userId: number };
  const ticketId = +_req.query.ticketId;

  try {
    if (!ticketId) {
      return res.status(httpStatus.BAD_REQUEST).send('Bad Request');
    }

    const [payments] = await paymentsService.getPayments({ userId, ticketId });

    return res.status(httpStatus.OK).send(payments);
  } catch (error) {
    next(error);
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

export async function postPayments(_req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const paymentInfo = _req.body as PaymentInfoType;
  const { userId } = _req as { userId: number };

  try {
    const payment = await paymentsService.postPayments({ paymentInfo, userId });

    return res.status(httpStatus.OK).send(payment);
  } catch (error) {
    next(error);
  }
}
