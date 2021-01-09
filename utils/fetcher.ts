import { JULLY_API_URL } from 'configs/constants';

export const fetcher = (authToken: string) => (
  endpoint: string,
): Promise<any> =>
  fetch(`${JULLY_API_URL + endpoint}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  }).then(res => res.json());
