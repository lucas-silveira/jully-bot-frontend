import axios, { AxiosInstance } from 'axios';

type CreateManagerData = {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  birthday: Date;
  billingAddress: {
    line1: string;
    line2: string;
    zipcode: string;
    city: string;
    state: string;
    country: string;
  };
};
type CreateSessionResponse = {
  managerId: number;
  accessToken: string;
};
type ResetPasswordData = {
  token: string | string[];
  password: string;
  passwordConfirm: string;
};
type GetAllBotsResponse = Array<{
  id: number;
  phone: string;
  name: string;
  openingHours: string[];
  welcomeMessage: string;
  managerId: number;
  createdAt: string;
  updatedAt: string;
  sessionsId: number[];
}>;

class JullyAPIService {
  randomid = Math.floor(Math.random() * 100) + 1;

  private api: AxiosInstance;

  private authorizationToken: string;

  constructor() {
    this.api = axios.create({
      baseURL: 'http://localhost:3333',
    });
  }

  setAuthorizationToken(token: string): void {
    this.authorizationToken = `Bearer ${token}`;
  }

  async createManager(managerData: CreateManagerData): Promise<void> {
    await this.api.post('/managers', managerData);
  }

  async createSession(
    email: string,
    password: string,
  ): Promise<CreateSessionResponse> {
    return (
      await this.api.post('/authentication', {
        email,
        password,
      })
    ).data;
  }

  async recoveryPassword(email: string): Promise<void> {
    await this.api.post('/managers/recovery-password', { email });
  }

  async resetPassword(resetPasswordData: ResetPasswordData): Promise<void> {
    await this.api.post('/managers/reset-password', resetPasswordData);
  }

  async getAllBots(managerId: number): Promise<GetAllBotsResponse> {
    this.api.defaults.headers['Authorization'] = this.authorizationToken;
    return (
      await this.api.get<GetAllBotsResponse>(`/managers/${managerId}/bots`)
    ).data;
  }
}

export default new JullyAPIService();
