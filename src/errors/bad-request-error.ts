import { ApplicationError } from '@/protocols';

export function badRequestError(): ApplicationError {
  return {
    name: 'badRequestError',
    message: 'bad Request!',
  };
}
