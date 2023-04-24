import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import hotelsService from '@/services/hotels-service';

type HotelRequest = Request & { userId?: number };

export async function getHotels(req: HotelRequest, res: Response, next: NextFunction) {
  const { userId } = req;

  try {
    if (!userId) {
      throw new Error('User ID not found in request object');
    }
    const hotels = await hotelsService.getHotels(userId);
    res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    next(error);
  }
}

export async function getHotelRooms(req: HotelRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  const hotelId = req.params.hotelId;

  try {
    if (!hotelId) {
      throw new Error('Hotel ID not found in request params');
    }
    const hotelWithRoom = await hotelsService.getHotelRooms(hotelId, userId);
    res.status(httpStatus.OK).send(hotelWithRoom);
  } catch (error) {
    next(error);
  }
}
