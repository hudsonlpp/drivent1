import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { postPaymentsSchema } from '@/schemas';
import { postPayments, getPayments } from '@/controllers';

const paymentsRouter = Router();

paymentsRouter.all('/*', authenticateToken);
paymentsRouter.get('/', getPayments);
paymentsRouter.post('/process', validateBody(postPaymentsSchema), postPayments);

export { paymentsRouter };
