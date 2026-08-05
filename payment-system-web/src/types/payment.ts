export interface CreatePaymentRequest {
    cardToken: string;
    merchantCode: string;
    amountMinor: number;
    currency: string;
}

export interface PaymentResult {
    paymentTransactionId: number;
    transactionReference: string;
    amountMinor: number;
    currency: string;
    status: string;
    responseCode: string;
    description: string;
    createdAt: string;
}

export interface PaymentTransaction {
    paymentTransactionId: number;
    transactionReference: string;

    cardId: number;
    cardBank: string;
    lastFourDigits: string;

    merchantId: number;
    merchantCode: string;
    merchantName: string;

    amountMinor: number;
    currency: string;

    status: string;
    responseCode: string;
    description: string;
    createdAt: string;
}