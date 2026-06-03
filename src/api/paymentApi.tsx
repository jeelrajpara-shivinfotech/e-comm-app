import { CREATE_PAYMENT, VERIFY_PAYMENT, REFUND_PAYMENT } from './apiRoutes';
import { authServices } from './apiService';

export interface CreatePaymentPayload {
  amount: number;
  currency: string;
  paymentMethod?: string;
}

export interface VerifyPaymentPayload {
  payment_id: string;
}

export interface RefundPaymentPayload {
  payment_id: string;
  amount: number;
}

export const createPaymentApi = async (data: CreatePaymentPayload) => {
  const response = await authServices.post(CREATE_PAYMENT, data);
  return response.data;
};

export const verifyPaymentApi = async (data: VerifyPaymentPayload) => {
  const response = await authServices.post(VERIFY_PAYMENT, data);
  return response.data;
};

export const refundPaymentApi = async (data: RefundPaymentPayload) => {
  const response = await authServices.post(REFUND_PAYMENT, data);
  return response.data;
};
