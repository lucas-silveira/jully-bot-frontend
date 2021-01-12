import { nanoid } from 'nanoid';

export const randomId = (size: number): string =>
  nanoid(size).replace(/-/g, '_');
