import { ApplicationError } from '@/protocols';

export function notFoundError(message?: string): ApplicationError {
  return {
    name: 'notFoundError',
    message: message || 'No result for this search!',
  };
}
