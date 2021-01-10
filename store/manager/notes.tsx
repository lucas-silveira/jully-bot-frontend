export type ManagerState = {
  id: number;
  name: string;
  email: string;
  birthday: string;
  billingAddress: {
    line1: string;
    line2: string;
    zipcode: string;
    city: string;
    state: string;
    country: string;
  };
  signature: {
    dueAt: string;
    plan: {
      id: number;
      botsQuantity: number;
      sessionsQuantity: number;
      messagesQuantity: number;
    };
  };
};

const managerState = {
  id: null,
  name: null,
  email: null,
  birthday: null,
  billingAddress: {
    line1: null,
    line2: null,
    zipcode: null,
    city: null,
    state: null,
    country: null,
  },
  signature: {
    dueAt: null,
    plan: {
      id: null,
      botsQuantity: null,
      sessionsQuantity: null,
      messagesQuantity: null,
    },
  },
};
