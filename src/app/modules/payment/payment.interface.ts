// payment.interface.ts
export interface IShurjoPayConfig {
  username: string;
  password: string;
  prefix: string;
  environment: string;
}

export interface IPaymentRequest {
  amount: number;
  storeId: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  clientIp: string;
}

export interface IPaymentResponse {
  checkout_url: string;
  sp_order_id: string;
  message: string;
  status: boolean;
}
