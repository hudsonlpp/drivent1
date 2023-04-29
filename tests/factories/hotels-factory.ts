import faker from '@faker-js/faker';
import { TicketStatus } from '@prisma/client';
import { generateValidToken } from '../helpers';
import { createUser } from './users-factory';
import { createEnrollmentWithAddress } from './enrollments-factory';
import { createTicketTypeWithHotel } from './tickets-factory';
import { createPayment } from './payments-factory';
import { createTicket } from '@/controllers';
import { prisma } from '@/config';

//Sabe criar objetos - Hotel do banco
export async function createHotel() {
  return await prisma.hotel.create({
    data: {
      name: faker.name.findName(),
      image: faker.image.imageUrl(),
    },
  });
}

export async function createRoomWithHotelId(hotelId: number) {
  return prisma.room.create({
    data: {
      name: '1020',
      capacity: 3,
      hotelId: hotelId,
    },
  });
}

// export async function createFunctionalRoom() {
//   const user = await createUser();
//   const token = await generateValidToken(user);
//   const enrollment = await createEnrollmentWithAddress(user);
//   const ticketType = await createTicketTypeWithHotel();
//   const ticket = await createTicket(enrollment, ticketType.id, TicketStatus.PAID);
//   await createPayment(ticket.id, ticketType.price);
//   const hotel = await createHotel();
//   const room = await createRoomWithHotelId(hotel.id);

//   return { token, userId: user.id, roomId: room.id, hotelId: hotel.id };
// }
