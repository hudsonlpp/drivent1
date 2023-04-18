import Joi, { ObjectSchema } from 'joi';

interface CardData {
  issuer: string;
  number: number;
  name: string;
  expirationDate: string | Date;
  cvv: number;
}

interface postPaymentsType {
  ticketId: number;
  cardData: CardData;
}

const cardDataSchema: ObjectSchema<CardData> = Joi.object({
  issuer: Joi.string().required(),
  number: Joi.number().required(),
  name: Joi.string().required(),
  expirationDate: Joi.string().required(),
  cvv: Joi.number().required(),
});

export const postPaymentsSchema: ObjectSchema<postPaymentsType> = Joi.object({
  ticketId: Joi.number().required(),
  cardData: cardDataSchema.required(),
});
