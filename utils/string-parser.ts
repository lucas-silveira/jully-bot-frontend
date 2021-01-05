export const removeSpecialCharacters = (value: string): string => {
  return value
    .replace(/[`~!@#$%^&*()|+=_\-?;:'",.<>\{\}\[\]\\\/]/gi, '')
    .replace(/\s+/gi, ' ');
};

export const replaceAccents = (value: string): string => {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

export const substring = (limit: number) => {
  return (value: string): string => value.substring(0, limit);
};
