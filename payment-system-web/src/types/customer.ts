export interface Customer {
    customerId: number;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: string;
    isActive: boolean;
}

export interface CreateCustomerRequest {
    firstName: string;
    lastName: string;
    email: string;
}