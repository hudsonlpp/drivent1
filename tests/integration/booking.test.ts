import httpStatus from 'http-status';
import supertest from 'supertest';
import * as jwt from 'jsonwebtoken';
import { cleanDb, generateValidToken } from '../helpers';

import {
  createEnrollmentWithAddress,
  createHotel,
  createRoomWithHotelId,
  createTicket,
  createTicketType,
  createTicketTypeRemote,
  createTicketTypeWithoutHotel,
  createUser,
} from '../factories';
import { createBooking } from '../factories/booking-factory';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const api = supertest(app);

describe('GET /booking', () => {
  describe('When token is invalid or doesnt exists', () => {
    it('Should respond with status 401 if no token is given', async () => {
      const result = await api.get('/hotels');

      expect(result.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('Should respond with status 401 if given token is not valid', async () => {
      const token = 'randomWord';
      const result = await api.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(result.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('Should respond with status 401 if there is no session for given token', async () => {
      const userWithoutSession = await createUser();
      const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
      const result = await api.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(result.status).toBe(httpStatus.UNAUTHORIZED);
    });
  });

  describe('When token is valid', () => {
    it('Should respond with status 404 if user has no booking', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const result = await api.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(result.status).toBe(httpStatus.NOT_FOUND);
    });

    it('Should respond with status 200 and booking', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);
      const booking = await createBooking(user.id, room.id);
      const result = await api.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(result.status).toBe(httpStatus.OK);
      expect(result.body).toEqual({
        id: booking.id,
        Room: {
          id: room.id,
          name: room.name,
          capacity: room.capacity,
          hotelId: room.hotelId,
          createdAt: room.createdAt.toISOString(),
          updatedAt: room.updatedAt.toISOString(),
        },
      });
    });
  });
});

describe('POST /booking', () => {
  describe('When token is invalid or doesnt exists', () => {
    it('Should respond with status 401 if no token is given', async () => {
      const result = await api.get('/hotels');

      expect(result.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('Should respond with status 401 if given token is not valid', async () => {
      const token = 'randomWord';
      const result = await api.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(result.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('Should respond with status 401 if there is no session for given token', async () => {
      const userWithoutSession = await createUser();
      const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

      const result = await api.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(result.status).toBe(httpStatus.UNAUTHORIZED);
    });
  });

  describe('When token is valid', () => {
    it('Should respond with status 400 when roomId is missing', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const result = await api.post('/booking').set('Authorization', `Bearer ${token}`);

      expect(result.status).toBe(httpStatus.BAD_REQUEST);
    });

    it('Should respond with status 403 when ticket is not PAID', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();
      await createTicket(enrollment.id, ticketType.id, 'RESERVED');

      const result = await api.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(result.status).toBe(httpStatus.FORBIDDEN);
    });

    it('Should respond with status 403 when ticket is remote', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeRemote();
      await createTicket(enrollment.id, ticketType.id, 'PAID');

      const result = await api.get('/hotels').set('Authorization', `Bearer ${token}`);
      expect(result.status).toBe(httpStatus.FORBIDDEN);
    });

    it('Should respond with status 403 when ticket doesnt includes hotel', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithoutHotel();
      await createTicket(enrollment.id, ticketType.id, 'PAID');

      const result = await api.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(result.status).toBe(httpStatus.FORBIDDEN);
    });
  });
});

describe('PUT /booking/:bookingId', () => {
  describe('When token is invalid or doesnt exists', () => {
    it('Should respond with status 401 if no token is given', async () => {
      const result = await api.get('/hotels');

      expect(result.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('Should respond with status 401 if given token is not valid', async () => {
      const token = 'randomWord';
      const result = await api.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(result.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('Should respond with status 401 if there is no session for given token', async () => {
      const userWithoutSession = await createUser();
      const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
      const result = await api.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(result.status).toBe(httpStatus.UNAUTHORIZED);
    });
  });
});
