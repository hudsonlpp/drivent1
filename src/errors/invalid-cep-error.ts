import { ApplicationError } from '@/protocols';

export function invalidCepError(): ApplicationError {
  return {
    name: 'InvalidCepError',
    message: 'Your cep need to have 8 numbers long!',
  };
}
