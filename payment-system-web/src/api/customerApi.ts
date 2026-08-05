import apiClient from './apiClient';

import type {
    CreateCustomerRequest,
    Customer,
} from '../types/customer';

export async function getCustomers(): Promise<Customer[]> {
    const response = await apiClient.get<Customer[]>(
        '/api/customers',
    );

    return response.data;
}

export async function getCustomerById(
    customerId: number,
): Promise<Customer> {
    const response = await apiClient.get<Customer>(
        `/api/customers/${customerId}`,
    );

    return response.data;
}

export async function createCustomer(
    request: CreateCustomerRequest,
): Promise<Customer> {
    const response = await apiClient.post<Customer>(
        '/api/customers',
        request,
    );

    return response.data;
}