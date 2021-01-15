import axios, { AxiosInstance } from 'axios';
import { JULLY_API_URL } from 'configs/constants';
import { ManagerState } from '@context/manager';

type CreateManagerDto = {
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
type ResetPasswordDto = {
  token: string | string[];
  password: string;
  passwordConfirm: string;
};
type BotAnswer = {
  id: string;
  correlationId: string;
  ownCorrelationId: string;
  type: string;
  optionNumber: number;
  text: string;
  questions: Array<{
    id: string;
    correlationId: string;
    ownCorrelationId: string;
    type: string;
    sortNumber: number;
    text: string;
    answers: any[];
  }>;
};
type BotQuestion = {
  id: string;
  correlationId: string;
  ownCorrelationId: string;
  type: string;
  sortNumber: number;
  text: string;
  answers: BotAnswer[];
};
type GetBotResponse = {
  id: number;
  phone: string;
  name: string;
  active: boolean;
  openingHours: Array<{
    dayWeek: number;
    startHour: string;
    endHour: string;
  }>;
  welcomeMessage: string;
  topics: Array<{
    id: number;
    correlationId: string;
    ownCorrelationId: string;
    type: string;
    optionNumber: number;
    name: string;
    description: string;
    questions: BotQuestion[];
  }>;
  managerId: number;
  sessionsId: number[];
  createdAt: string;
  updatedAt: string;
};
type GetAllBotsResponse = Array<{
  id: number;
  phone: string;
  name: string;
  openingHours: Array<{
    dayWeek: number;
    startHour: string;
    endHour: string;
  }>;
  welcomeMessage: string;
  managerId: number;
  sessionsId: number[];
  createdAt: string;
  updatedAt: string;
}>;

class JullyApiService {
  public API_URL = JULLY_API_URL;

  public authorizationToken: string;

  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: this.API_URL,
    });
    this.api.interceptors.response.use(
      response => response,
      error => {
        if (error.response.status === 401) {
          localStorage.removeItem('@jullybot:auth');
          localStorage.removeItem('@jullybot:manager');
          this.setAuthorizationToken(null);
        }

        throw error;
      },
    );
  }

  setAuthorizationToken(token: string): void {
    this.authorizationToken = token;
    this.api.defaults.headers['Authorization'] = `Bearer ${token}`;
  }

  async createManager(managerDto: CreateManagerDto): Promise<void> {
    await this.api.post('/managers', managerDto);
  }

  async getManager(): Promise<ManagerState> {
    return (await this.api.get<ManagerState>('/managers'))?.data;
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
    )?.data;
  }

  async recoveryPassword(email: string): Promise<void> {
    await this.api.post('/managers/recovery-password', { email });
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    await this.api.post('/managers/reset-password', resetPasswordDto);
  }

  async getBot(managerId: number, botPhone: string): Promise<GetBotResponse> {
    return (
      await this.api.get<GetBotResponse>(
        `/managers/${managerId}/bots/${botPhone}`,
      )
    )?.data;
  }

  async getAllBots(managerId: number): Promise<GetAllBotsResponse> {
    return (
      await this.api.get<GetAllBotsResponse>(`/managers/${managerId}/bots`)
    )?.data;
  }
}

export default new JullyApiService();
