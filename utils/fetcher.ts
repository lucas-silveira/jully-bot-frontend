export const fetcher = (...args) =>
  fetch(args.shift(), ...args).then(res => res.json());
