import httpStatus from 'http-status';
import supertest from 'supertest';
import * as jwt from 'jsonwebtoken';
import { TicketStatus } from '@prisma/client';
import { cleanDb, generateValidToken } from '../helpers';

import {
  createEnrollmentWithAddress,
  createPayment,
  createTicket,
  createTicketTypeWithHotel,
  createUser,
  createHotel,
  createRoomWithHotelId,
  createFunctionalRoom,
  createTicketTypeRemote,
  createTicketTypeWithoutHotel,
  createTicketType,
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
      const result = await api.get('/booking');

      expect(result.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('Should respond with status 401 if given token is not valid', async () => {
      const token = 'randomWord';
      const result = await api.get('/booking').set('Authorization', `Bearer ${token}`);

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
    it('Should respond with status 404 if user has no booking', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const result = await api.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(result.status).toBe(httpStatus.NOT_FOUND);
    });
  });
});

describe('POST /booking', () => {
  describe('When token is invalid or doesnt exists', () => {
    it('Should respond with status 401 if no token is given', async () => {
      const result = await api.get('/booking');

      expect(result.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('Should respond with status 401 if given token is not valid', async () => {
      const token = 'randomWord';
      const result = await api.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(result.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('Should respond with status 401 if there is no session for given token', async () => {
      const userWithoutSession = await createUser();
      const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

      const result = await api.get('/booking').set('Authorization', `Bearer ${token}`);

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
      const body = { roomId: 1 };
      const result = await api.post('/booking').set('Authorization', `Bearer ${token}`).send(body);
      expect(result.status).toBe(httpStatus.FORBIDDEN);
    });

    it('Should respond with status 403 when ticket is remote', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeRemote();
      const ticket = await createTicket(enrollment.id, ticketType.id, 'PAID');
      const payment = await createPayment(ticket.id, ticketType.price);
      const body = { roomId: 1 };
      const result = await api.post('/booking').set('Authorization', `Bearer ${token}`).send(body);
      expect(result.status).toBe(httpStatus.FORBIDDEN);
    });

    it('Should respond with status 403 when ticket doesnt includes hotel', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithoutHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, 'PAID');
      const payment = await createPayment(ticket.id, ticketType.price);
      const body = { roomId: 1 };
      const result = await api.post('/booking').set('Authorization', `Bearer ${token}`).send(body);

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

    describe('when token is valid', () => {
      it('should return 403 if user has no booking', async () => {
        const { token, roomId } = await createFunctionalRoom();

        const response = await api.put('/booking/1').set('Authorization', `Bearer ${token}`).send({ roomId });

        expect(response.status).toBe(httpStatus.FORBIDDEN);
      });

      // it('should respond with status 403 with invalid bookingId', async () => {
      //   const user = await createUser();
      //   const token = await generateValidToken(user);
      //   const enrollment = await createEnrollmentWithAddress(user);
      //   const ticketType = await createTicketTypeWithoutHotel();
      //   const ticket = await createTicket(enrollment.id, ticketType.id, 'PAID');
      //   const payment = await createPayment(ticket.id, ticketType.price);
      //   const hotel = await createHotel();
      //   const room = await createRoomWithHotelId(hotel.id);
      //   const booking = await createBooking(user.id, room.id);
      //   const otherRoom = await createRoomWithHotelId(hotel.id);
      //   const bookingId = booking.id;
      //   const response = await api.put(`/booking/${bookingId + 1}`).set('Authorization', `Bearer ${token}`).send({
      //       roomId: otherRoom.id,
      //     });
      //     expect(response.status).toEqual(httpStatus.FORBIDDEN);
      //   });

      it('should return 400 if roomId is not provided', async () => {
        const { token, roomId, userId } = await createFunctionalRoom();
        const { id: bookingId } = await createBooking(userId, roomId);

        const response = await api.put(`/booking/${bookingId}`).set('Authorization', `Bearer ${token}`).send({});

        expect(response.status).toBe(httpStatus.BAD_REQUEST);
      });

      it('should return 404 if roomId is invalid', async () => {
        const { token, roomId, userId } = await createFunctionalRoom();
        const { id: bookingId } = await createBooking(userId, roomId);

        const response = await api
          .put(`/booking/${bookingId}`)
          .set('Authorization', `Bearer ${token}`)
          .send({ roomId: roomId + 1 });

        expect(response.status).toBe(httpStatus.NOT_FOUND);
      });

      it('should return 403 if room is not available', async () => {
        const { userId, roomId } = await createFunctionalRoom();
        const { id: bookingId } = await createBooking(userId, roomId);

        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        await createPayment(ticket.id, ticketType.price);

        const response = await api
          .put(`/booking/${bookingId}`)
          .set('Authorization', `Bearer ${token}`)
          .send({ roomId });

        expect(response.status).toBe(httpStatus.FORBIDDEN);
      });

      it('should return 200 if the booking is updated and return bookingId', async () => {
        const { token, roomId, userId, hotelId } = await createFunctionalRoom();
        const { id: bookingId } = await createBooking(userId, roomId);
        const room2 = await createRoomWithHotelId(hotelId);

        const response = await api
          .put(`/booking/${bookingId}`)
          .set('Authorization', `Bearer ${token}`)
          .send({ roomId: room2.id });

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual({
          bookingId,
        });
      });
    });
  });
});
