import { Router } from 'express';
import { authenticateToken, validateBody, validateParams } from '@/middlewares';
import { getBooking, postBooking, updateBooking } from '@/controllers/booking-controller';
import { bookingsBodySchema, bookingsParamsSchema } from '@/schemas/booking-schema';

const bookingRouter = Router();

bookingRouter
  .all('/*', authenticateToken)
  .get('/', getBooking)
  .post('/', postBooking)
  .put('/:bookingId', validateParams(bookingsParamsSchema), validateBody(bookingsBodySchema), updateBooking);

export { bookingRouter };
