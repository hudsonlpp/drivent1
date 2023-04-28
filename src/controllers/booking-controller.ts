import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import bookingService from '@/services/booking-service';

export async function getBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  try {
    const booking = await bookingService.getBooking(userId);

    return res.status(httpStatus.OK).send(booking);
  } catch (e) {
    next(e);
  }
}

export async function postBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  const { roomId } = req.body;
  if (!roomId) return res.sendStatus(httpStatus.BAD_REQUEST);
  try {
    const idBooking = await bookingService.postBooking(userId, parseInt(roomId));

    return res.status(httpStatus.OK).send({ bookingId: idBooking });
  } catch (e) {
    next(e);
  }
}

export async function updateBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  const { bookingId } = req.params;
  const { roomId } = req.body;
  if (!roomId) return res.sendStatus(httpStatus.BAD_REQUEST);
  if (!bookingId) return res.sendStatus(httpStatus.BAD_REQUEST);
  try {
    const bookingUpdated = await bookingService.updateBooking(userId, bookingId, parseInt(roomId));

    return res.status(httpStatus.OK).send({ bookingId: bookingUpdated });
  } catch (e) {
    console.log(e);
    next(e);
  }
}
