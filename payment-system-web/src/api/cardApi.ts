import apiClient from './apiClient';

import type {
    Card,
    CreateCardRequest,
} from '../types/card';

export async function getCardsByBankAccountId(
    bankAccountId: number,
): Promise<Card[]> {
    const response = await apiClient.get<Card[]>(
        `/api/cards/by-bank-account/${bankAccountId}`,
    );

    return response.data;
}

export async function createCard(
    request: CreateCardRequest,
): Promise<Card> {
    const response = await apiClient.post<Card>(
        '/api/cards',
        request,
    );

    return response.data;
}