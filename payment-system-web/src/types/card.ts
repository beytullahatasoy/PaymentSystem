export interface Card {
    cardId: number;
    bankAccountId: number;
    cardToken: string;
    cardBank: string;
    lastFourDigits: string;
    expiryMonth: number;
    expiryYear: number;
    dailyLimitMinor: number;
    status: string;
    createdAt: string;
}

export interface CreateCardRequest {
    bankAccountId: number;
    cardBank: string;
    dailyLimitMinor: number;
}