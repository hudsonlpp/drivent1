import { Router } from 'express';
import { createTicket, findTickets, findTicketTypes } from '@/controllers';
import { authenticateToken, validateBody } from '@/middlewares';
import { createTicketSchema } from '@/schemas';

const ticketsRouter = Router();

ticketsRouter.all('/*', authenticateToken);
ticketsRouter.get('/', findTickets);
ticketsRouter.get('/types', findTicketTypes);
ticketsRouter.post('/', validateBody(createTicketSchema), createTicket);

export { ticketsRouter };
