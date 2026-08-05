import apiClient from './apiClient';

import type {
    CreatePaymentRequest,
    PaymentResult,
    PaymentTransaction,
} from '../types/payment';

export async function processPayment(
    request: CreatePaymentRequest,
): Promise<PaymentResult> {
    const response =
        await apiClient.post<PaymentResult>(
            '/api/payments',
            request,
        );

    return response.data;
}

export async function getPayments(): Promise<
    PaymentTransaction[]
> {
    const response =
        await apiClient.get<PaymentTransaction[]>(
            '/api/payments',
        );

    return response.data;
}

export async function getPaymentById(
    paymentTransactionId: number,
): Promise<PaymentTransaction> {
    const response =
        await apiClient.get<PaymentTransaction>(
            `/api/payments/${paymentTransactionId}`,
        );

    return response.data;
}