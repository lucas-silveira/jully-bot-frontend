import { DefaultValue } from 'recoil';

export const localStorageEffect = (key: string) => ({
  setSelf,
  onSet,
}): void => {
  if (typeof localStorage === 'undefined') return;

  const savedValue = localStorage.getItem(key);
  if (savedValue !== null) {
    setSelf(JSON.parse(savedValue));
  }

  onSet(newValue => {
    if (newValue instanceof DefaultValue) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(newValue));
    }
  });
};
