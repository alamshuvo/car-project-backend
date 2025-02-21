/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
// src/shared/shurjopay.ts
import axios from 'axios';
import moment from 'moment';
import { createLogger, format, transports } from 'winston';
import config from '../config';

export interface IShurjoPayConfig {
  root_url: string;
  merchant_username: string;
  merchant_password: string;
  merchant_key_prefix: string;
  return_url: string;
}

export interface IShurjoPayToken {
  token: string;
  token_type: string;
  TokenCreateTime: string;
  expires_in: number;
  store_id: string;
  execute_url: string;
}

export interface ICheckoutParams {
  amount: number;
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  clientIp: string;
}

const spConfig: IShurjoPayConfig = {
  root_url: config.sp_endpoint as string,
  merchant_username: config.sp_username as string,
  merchant_password: config.sp_password as string,
  merchant_key_prefix: config.sp_prefix as string,
  return_url: config.sp_return_url as string,
};

class ShurjoPay {
  private credentials: IShurjoPayConfig;
  private token: IShurjoPayToken | null = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private logger: any;

  constructor() {
    this.credentials = spConfig;
    this.initializeLogger();
  }

  private initializeLogger() {
    this.logger = createLogger({
      format: format.combine(
        format.label({ label: 'shurjopay' }),
        format.timestamp(),
        format.printf(({ level, message, label, timestamp }) => {
          return `${timestamp} [${label}] ${level}: ${message}`;
        }),
      ),
      transports: [
        new transports.Console(),
        new transports.File({ filename: 'shurjopay-plugin.log' }),
      ],
    });
  }

  private async getToken(): Promise<IShurjoPayToken> {
    try {
      const response = await axios.post(
        `${this.credentials.root_url}/api/get_token`,
        {
          username: this.credentials.merchant_username,
          password: this.credentials.merchant_password,
        },
      );
      this.token = response.data;
      return response.data;
    } catch (error) {
      this.logger.error('Failed to get authentication token');
      throw new Error('Authentication failed');
    }
  }

  private isTokenValid(): boolean {
    if (!this.token) return false;

    const createTime = moment(
      this.token.TokenCreateTime,
      'YYYY-MM-DD hh:mm:ssa',
    );
    const duration = moment().diff(createTime, 'seconds');
    return duration < this.token.expires_in;
  }

  private async ensureValidToken(): Promise<IShurjoPayToken> {
    if (!this.isTokenValid()) {
      return this.getToken();
    }
    return this.token!;
  }

  async makePayment(params: ICheckoutParams) {
    try {
      const token = await this.ensureValidToken();

      const response = await axios.post(token.execute_url, {
        ...params,
        prefix: this.credentials.merchant_key_prefix,
        store_id: token.store_id,
        token: token.token,
        return_url: this.credentials.return_url,
        cancel_url: this.credentials.return_url,
      });

      return response.data;
    } catch (error) {
      this.logger.error('Payment initiation failed');
      throw new Error('Failed to initiate payment');
    }
  }

  async verifyPayment(orderId: string) {
    try {
      const token = await this.ensureValidToken();

      const response = await axios.post(
        `${this.credentials.root_url}/api/verification`,
        { order_id: orderId },
        {
          headers: {
            Authorization: `${token.token_type} ${token.token}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      console.log(error);
      this.logger.error('Payment verification failed');
      throw new Error('Failed to verify payment');
    }
  }

  async checkPaymentStatus(orderId: string) {
    try {
      const token = await this.ensureValidToken();

      const response = await axios.post(
        `${this.credentials.root_url}/api/payment-status`,
        { order_id: orderId },
        {
          headers: {
            Authorization: `${token.token_type} ${token.token}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      console.log(error);
      this.logger.error('Payment status check failed');
      throw new Error('Failed to check payment status');
    }
  }
}

export default ShurjoPay;
