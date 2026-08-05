import apiClient from './apiClient';

import type {
    BankAccount,
    CreateBankAccountRequest,
    DepositBankAccountRequest,
} from '../types/bankAccount';



export async function getBankAccountsByCustomerId(
    customerId: number,
): Promise<BankAccount[]> {
    const response = await apiClient.get<BankAccount[]>(
        `/api/bank-accounts/by-customer/${customerId}`,
    );

    return response.data;
}

export async function getBankAccountById(
    bankAccountId: number,
): Promise<BankAccount> {
    const response = await apiClient.get<BankAccount>(
        `/api/bank-accounts/${bankAccountId}`,
    );

    return response.data;
}

export async function createBankAccount(
    request: CreateBankAccountRequest,
): Promise<BankAccount> {
    const response = await apiClient.post<BankAccount>(
        '/api/bank-accounts',
        request,
    );

    return response.data;
}

export async function depositBankAccount(
    bankAccountId: number,
    request: DepositBankAccountRequest,
): Promise<BankAccount> {
    const response = await apiClient.post<BankAccount>(
        `/api/bank-accounts/${bankAccountId}/deposit`,
        request,
    );

    return response.data;
}