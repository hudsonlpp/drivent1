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

    const [payments] = await paymentsService.findPayments({ userId, ticketId });

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

const { userId } = _req as { userId: number };
const ticketId = +_req.query.ticketId;

try {
  if (!ticketId) throw badRequestError();

  const [payments] = await paymentsService.findPayments({ userId, ticketId });

  return res.status(httpStatus.OK).send(payments);
} catch (error) {
  if (error.name === 'BadRequestError') {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
  if (error.name === 'NotFoundError') {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
  if (error.name === 'UnauthorizedError') {
    return res.status(httpStatus.UNAUTHORIZED).send('Unauthorized');
  }
  return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
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

export async function createPayment(_req: AuthenticatedRequest, res: Response) {
  const paymentInfo = _req.body as PaymentInfoType;
  const { userId } = _req as { userId: number };

  try {
    const payment = await paymentsService.createPayment({ paymentInfo, userId });

    return res.status(httpStatus.OK).send(payment);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if (error.name === 'UnauthorizedError') {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    console.log(error);
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}
