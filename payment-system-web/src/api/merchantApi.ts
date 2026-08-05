import apiClient from './apiClient';

import type {
    CreateMerchantRequest,
    Merchant,
} from '../types/merchant';

export async function getMerchants(): Promise<Merchant[]> {
    const response = await apiClient.get<Merchant[]>(
        '/api/merchants',
    );

    return response.data;
}

export async function getMerchantById(
    merchantId: number,
): Promise<Merchant> {
    const response = await apiClient.get<Merchant>(
        `/api/merchants/${merchantId}`,
    );

    return response.data;
}

export async function createMerchant(
    request: CreateMerchantRequest,
): Promise<Merchant> {
    const response = await apiClient.post<Merchant>(
        '/api/merchants',
        request,
    );

    return response.data;
}