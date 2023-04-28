import { ApplicationError } from '@/protocols';

export function cannotBookError(): ApplicationError {
  return {
    name: 'CannotBookError',
    message: 'This room is unavailable',
  };
}
